#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
博客可视化格式迁移脚本
用于统一历史文件的可视化格式，优化性能
"""

import os
import re
import json
from pathlib import Path

class VisualizationMigrator:
    def __init__(self, posts_dir="_posts"):
        self.posts_dir = Path(posts_dir)
        self.migration_stats = {
            'processed_files': 0,
            'mermaid_blocks': 0,
            'echarts_blocks': 0,
            'chartjs_blocks': 0,
            'plotly_blocks': 0,
            'converted_blocks': 0
        }
    
    def analyze_file(self, file_path):
        """分析文件中的可视化内容"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        stats = {
            'mermaid_blocks': len(re.findall(r'```mermaid\s*\n(.*?)\n```', content, re.DOTALL)),
            'echarts_blocks': len(re.findall(r'```echarts\s*\n(.*?)\n```', content, re.DOTALL)),
            'chartjs_blocks': len(re.findall(r'```chartjs\s*\n(.*?)\n```', content, re.DOTALL)),
            'plotly_blocks': len(re.findall(r'```plotly\s*\n(.*?)\n```', content, re.DOTALL)),
            'inline_echarts': len(re.findall(r'<div class="echarts-container"', content)),
            'inline_chartjs': len(re.findall(r'<div class="chartjs-container"', content)),
            'inline_plotly': len(re.findall(r'<div class="plotly-chart"', content))
        }
        
        return stats
    
    def migrate_mermaid_blocks(self, content):
        """迁移Mermaid代码块到统一格式"""
        def replace_mermaid(match):
            mermaid_code = match.group(1).strip()
            return f'```mermaid\n{mermaid_code}\n```'
        
        # 保持Mermaid格式不变，但确保格式统一
        content = re.sub(r'```mermaid\s*\n(.*?)\n```', replace_mermaid, content, flags=re.DOTALL)
        return content
    
    def migrate_echarts_blocks(self, content):
        """迁移ECharts代码块到容器格式"""
        def replace_echarts(match):
            echarts_config = match.group(1).strip()
            try:
                # 验证JSON格式
                json.loads(echarts_config)
                return f'<div class="echarts-container" data-option=\'{echarts_config}\'></div>'
            except json.JSONDecodeError:
                print(f"警告: 无效的ECharts JSON配置")
                return match.group(0)
        
        content = re.sub(r'```echarts\s*\n(.*?)\n```', replace_echarts, content, flags=re.DOTALL)
        return content
    
    def migrate_chartjs_blocks(self, content):
        """迁移Chart.js代码块到容器格式"""
        def replace_chartjs(match):
            chartjs_config = match.group(1).strip()
            try:
                # 验证JSON格式
                config = json.loads(chartjs_config)
                chart_type = config.get('type', 'line')
                return f'<div class="chartjs-container" data-type="{chart_type}" data-config=\'{chartjs_config}\'></div>'
            except json.JSONDecodeError:
                print(f"警告: 无效的Chart.js JSON配置")
                return match.group(0)
        
        content = re.sub(r'```chartjs\s*\n(.*?)\n```', replace_chartjs, content, flags=re.DOTALL)
        return content
    
    def migrate_plotly_blocks(self, content):
        """迁移Plotly代码块到容器格式"""
        def replace_plotly(match):
            plotly_config = match.group(1).strip()
            try:
                # 解析Plotly配置
                config = json.loads(plotly_config)
                data = config.get('data', [])
                layout = config.get('layout', {})
                return f'<div class="plotly-chart" data-plotly-data=\'{json.dumps(data)}\' data-plotly-layout=\'{json.dumps(layout)}\'></div>'
            except json.JSONDecodeError:
                print(f"警告: 无效的Plotly JSON配置")
                return match.group(0)
        
        content = re.sub(r'```plotly\s*\n(.*?)\n```', replace_plotly, content, flags=re.DOTALL)
        return content
    
    def optimize_inline_containers(self, content):
        """优化内联容器格式"""
        # 统一ECharts容器格式
        content = re.sub(
            r'<div class="echarts-container"([^>]*)>',
            r'<div class="echarts-container visualization-container"\1>',
            content
        )
        
        # 统一Chart.js容器格式
        content = re.sub(
            r'<div class="chartjs-container"([^>]*)>',
            r'<div class="chartjs-container visualization-container"\1>',
            content
        )
        
        # 统一Plotly容器格式
        content = re.sub(
            r'<div class="plotly-chart"([^>]*)>',
            r'<div class="plotly-chart visualization-container"\1>',
            content
        )
        
        return content
    
    def migrate_file(self, file_path):
        """迁移单个文件"""
        print(f"处理文件: {file_path}")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 执行迁移
        content = self.migrate_mermaid_blocks(content)
        content = self.migrate_echarts_blocks(content)
        content = self.migrate_chartjs_blocks(content)
        content = self.migrate_plotly_blocks(content)
        content = self.optimize_inline_containers(content)
        
        # 如果内容有变化，写回文件
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ 已更新: {file_path}")
            return True
        else:
            print(f"- 无需更新: {file_path}")
            return False
    
    def run_migration(self):
        """运行迁移"""
        print("开始可视化格式迁移...")
        print("=" * 50)
        
        # 获取所有markdown文件
        md_files = list(self.posts_dir.glob("*.md"))
        
        for file_path in md_files:
            try:
                # 分析文件
                stats = self.analyze_file(file_path)
                
                # 更新统计
                self.migration_stats['processed_files'] += 1
                self.migration_stats['mermaid_blocks'] += stats['mermaid_blocks']
                self.migration_stats['echarts_blocks'] += stats['echarts_blocks']
                self.migration_stats['chartjs_blocks'] += stats['chartjs_blocks']
                self.migration_stats['plotly_blocks'] += stats['plotly_blocks']
                
                # 迁移文件
                if self.migrate_file(file_path):
                    self.migration_stats['converted_blocks'] += 1
                
                # 显示文件统计
                if any(stats.values()):
                    print(f"  统计: Mermaid({stats['mermaid_blocks']}) "
                          f"ECharts({stats['echarts_blocks']}) "
                          f"Chart.js({stats['chartjs_blocks']}) "
                          f"Plotly({stats['plotly_blocks']})")
                
            except Exception as e:
                print(f"✗ 处理文件失败 {file_path}: {e}")
        
        self.print_summary()
    
    def print_summary(self):
        """打印迁移总结"""
        print("\n" + "=" * 50)
        print("迁移完成！")
        print(f"处理文件数: {self.migration_stats['processed_files']}")
        print(f"Mermaid代码块: {self.migration_stats['mermaid_blocks']}")
        print(f"ECharts代码块: {self.migration_stats['echarts_blocks']}")
        print(f"Chart.js代码块: {self.migration_stats['chartjs_blocks']}")
        print(f"Plotly代码块: {self.migration_stats['plotly_blocks']}")
        print(f"已转换文件: {self.migration_stats['converted_blocks']}")
        print("=" * 50)

def main():
    """主函数"""
    migrator = VisualizationMigrator()
    migrator.run_migration()

if __name__ == "__main__":
    main() 