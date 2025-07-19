#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
博客可视化性能监控脚本
用于分析博客的可视化使用情况和性能优化建议
"""

import os
import re
import json
from pathlib import Path
from collections import defaultdict

class PerformanceMonitor:
    def __init__(self, posts_dir="_posts"):
        self.posts_dir = Path(posts_dir)
        self.analysis_results = {
            'total_files': 0,
            'files_with_visualizations': 0,
            'visualization_types': defaultdict(int),
            'performance_issues': [],
            'optimization_suggestions': []
        }
    
    def analyze_file_performance(self, file_path):
        """分析单个文件的性能"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        file_stats = {
            'file': file_path.name,
            'size_kb': len(content) / 1024,
            'visualization_count': 0,
            'types': defaultdict(int),
            'issues': []
        }
        
        # 统计各种可视化类型
        mermaid_blocks = len(re.findall(r'```mermaid\s*\n(.*?)\n```', content, re.DOTALL))
        echarts_blocks = len(re.findall(r'```echarts\s*\n(.*?)\n```', content, re.DOTALL))
        chartjs_blocks = len(re.findall(r'```chartjs\s*\n(.*?)\n```', content, re.DOTALL))
        plotly_blocks = len(re.findall(r'```plotly\s*\n(.*?)\n```', content, re.DOTALL))
        
        inline_echarts = len(re.findall(r'<div class="echarts-container"', content))
        inline_chartjs = len(re.findall(r'<div class="chartjs-container"', content))
        inline_plotly = len(re.findall(r'<div class="plotly-chart"', content))
        inline_d3 = len(re.findall(r'<div class="d3-chart"', content))
        inline_three = len(re.findall(r'<div class="three-js-container"', content))
        
        # 更新统计
        file_stats['types']['mermaid'] = mermaid_blocks
        file_stats['types']['echarts'] = echarts_blocks + inline_echarts
        file_stats['types']['chartjs'] = chartjs_blocks + inline_chartjs
        file_stats['types']['plotly'] = plotly_blocks + inline_plotly
        file_stats['types']['d3'] = inline_d3
        file_stats['types']['three'] = inline_three
        
        total_visualizations = sum(file_stats['types'].values())
        file_stats['visualization_count'] = total_visualizations
        
        # 性能问题检测
        if total_visualizations > 10:
            file_stats['issues'].append(f"可视化数量过多({total_visualizations}个)，建议分页或懒加载")
        
        if file_stats['size_kb'] > 100:
            file_stats['issues'].append(f"文件过大({file_stats['size_kb']:.1f}KB)，建议优化")
        
        if inline_plotly > 0 and not plotly_blocks:
            file_stats['issues'].append("检测到Plotly内联使用，建议使用按需加载")
        
        if inline_d3 > 0:
            file_stats['issues'].append("检测到D3.js使用，确保按需加载")
        
        if inline_three > 0:
            file_stats['issues'].append("检测到Three.js使用，确保按需加载")
        
        return file_stats
    
    def analyze_visualization_complexity(self, content):
        """分析可视化复杂度"""
        complexity_score = 0
        
        # ECharts复杂度分析
        echarts_configs = re.findall(r'```echarts\s*\n(.*?)\n```', content, re.DOTALL)
        for config in echarts_configs:
            try:
                data = json.loads(config)
                if 'series' in data and len(data['series']) > 3:
                    complexity_score += 2
                if 'animation' in data and data['animation']:
                    complexity_score += 1
            except:
                pass
        
        # 内联ECharts复杂度分析
        inline_echarts = re.findall(r'data-option=\'(.*?)\'', content)
        for option in inline_echarts:
            try:
                data = json.loads(option)
                if 'series' in data and len(data['series']) > 3:
                    complexity_score += 2
            except:
                pass
        
        return complexity_score
    
    def generate_optimization_suggestions(self):
        """生成优化建议"""
        suggestions = []
        
        # 基于分析结果生成建议
        if self.analysis_results['visualization_types']['plotly'] > 0:
            suggestions.append("检测到Plotly使用，建议启用按需加载以提升性能")
        
        if self.analysis_results['visualization_types']['d3'] > 0:
            suggestions.append("检测到D3.js使用，建议启用按需加载以提升性能")
        
        if self.analysis_results['visualization_types']['three'] > 0:
            suggestions.append("检测到Three.js使用，建议启用按需加载以提升性能")
        
        # 检查是否有文件包含过多可视化
        heavy_files = [f for f in self.analysis_results.get('file_details', []) 
                      if f['visualization_count'] > 5]
        if heavy_files:
            suggestions.append(f"发现{len(heavy_files)}个文件包含过多可视化，建议实施懒加载")
        
        return suggestions
    
    def run_analysis(self):
        """运行完整分析"""
        print("开始性能分析...")
        print("=" * 50)
        
        md_files = list(self.posts_dir.glob("*.md"))
        self.analysis_results['total_files'] = len(md_files)
        file_details = []
        
        for file_path in md_files:
            try:
                file_stats = self.analyze_file_performance(file_path)
                file_details.append(file_stats)
                
                # 更新全局统计
                if file_stats['visualization_count'] > 0:
                    self.analysis_results['files_with_visualizations'] += 1
                
                for viz_type, count in file_stats['types'].items():
                    self.analysis_results['visualization_types'][viz_type] += count
                
                # 显示文件分析结果
                if file_stats['visualization_count'] > 0:
                    print(f"📊 {file_path.name}")
                    print(f"   可视化数量: {file_stats['visualization_count']}")
                    print(f"   文件大小: {file_stats['size_kb']:.1f}KB")
                    
                    for viz_type, count in file_stats['types'].items():
                        if count > 0:
                            print(f"   - {viz_type}: {count}")
                    
                    if file_stats['issues']:
                        print(f"   ⚠️  问题: {', '.join(file_stats['issues'])}")
                    print()
                
            except Exception as e:
                print(f"✗ 分析文件失败 {file_path}: {e}")
        
        self.analysis_results['file_details'] = file_details
        self.analysis_results['optimization_suggestions'] = self.generate_optimization_suggestions()
        
        self.print_summary()
    
    def print_summary(self):
        """打印分析总结"""
        print("=" * 50)
        print("📈 性能分析总结")
        print("=" * 50)
        
        print(f"📁 总文件数: {self.analysis_results['total_files']}")
        print(f"📊 包含可视化的文件: {self.analysis_results['files_with_visualizations']}")
        print()
        
        print("📊 可视化类型统计:")
        for viz_type, count in self.analysis_results['visualization_types'].items():
            print(f"   - {viz_type}: {count}")
        print()
        
        if self.analysis_results['optimization_suggestions']:
            print("💡 优化建议:")
            for suggestion in self.analysis_results['optimization_suggestions']:
                print(f"   - {suggestion}")
            print()
        
        # 性能评分
        total_viz = sum(self.analysis_results['visualization_types'].values())
        if total_viz == 0:
            print("✅ 当前博客没有可视化内容，性能优秀")
        elif total_viz <= 20:
            print("✅ 可视化数量适中，性能良好")
        elif total_viz <= 50:
            print("⚠️  可视化数量较多，建议优化")
        else:
            print("❌ 可视化数量过多，需要立即优化")
        
        print("=" * 50)
    
    def export_report(self, output_file="performance_report.json"):
        """导出分析报告"""
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.analysis_results, f, ensure_ascii=False, indent=2)
        print(f"📄 分析报告已导出到: {output_file}")

def main():
    """主函数"""
    monitor = PerformanceMonitor()
    monitor.run_analysis()
    monitor.export_report()

if __name__ == "__main__":
    main() 