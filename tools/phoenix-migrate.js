#!/usr/bin/env node
/**
 * Phoenix Migration Tool
 * 零故障可视化平台迁移工具
 * 作者：KingdeGuo
 * 版本：2.0.0
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class PhoenixMigrator {
  constructor(options = {}) {
    this.postsDir = options.postsDir || '_posts';
    this.backupDir = options.backupDir || '_backup';
    this.verbose = options.verbose || false;
    
    this.stats = {
      processed: 0,
      updated: 0,
      errors: 0,
      formats: {
        legacy: 0,
        modern: 0,
        mixed: 0
      }
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  async init() {
    this.log('🚀 Phoenix Migration Tool 初始化...');
    
    // 创建备份目录
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      this.log(`创建备份目录: ${this.backupDir}`);
    }

    // 获取所有markdown文件
    const files = glob.sync(`${this.postsDir}/**/*.md`);
    this.log(`发现 ${files.length} 个markdown文件`);
    
    return files;
  }

  async analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const analysis = {
      filePath,
      content,
      hasLegacyFormat: false,
      hasModernFormat: false,
      charts: {
        mermaid: [],
        echarts: [],
        chartjs: [],
        plotly: [],
        d3: [],
        three: []
      },
      issues: []
    };

    // 检测旧格式
    const legacyPatterns = {
      mermaid: /```mermaid\s*\n([\s\S]*?)\n```/g,
      echarts: /```echarts\s*\n([\s\S]*?)\n```/g,
      chartjs: /```chartjs\s*\n([\s\S]*?)\n```/g,
      plotly: /```plotly\s*\n([\s\S]*?)\n```/g,
      d3: /```d3\s*\n([\s\S]*?)\n```/g,
      three: /```three\s*\n([\s\S]*?)\n```/g
    };

    // 检测内联容器格式
    const inlinePatterns = {
      echarts: /<div class="echarts-container"[^>]*>/g,
      chartjs: /<div class="chartjs-container"[^>]*>/g,
      plotly: /<div class="plotly-chart"[^>]*>/g,
      d3: /<div class="d3-container"[^>]*>/g,
      three: /<div class="three-container"[^>]*>/g
    };

    // 检测现代格式
    const modernPattern = /data-chart=/g;

    // 分析每种格式
    Object.keys(legacyPatterns).forEach(type => {
      let match;
      while ((match = legacyPatterns[type].exec(content)) !== null) {
        analysis.charts[type].push({
          type: 'legacy',
          content: match[1],
          start: match.index,
          end: match.index + match[0].length
        });
        analysis.hasLegacyFormat = true;
      }
    });

    Object.keys(inlinePatterns).forEach(type => {
      let match;
      while ((match = inlinePatterns[type].exec(content)) !== null) {
        analysis.charts[type].push({
          type: 'inline',
          content: match[0],
          start: match.index,
          end: match.index + match[0].length
        });
        analysis.hasLegacyFormat = true;
      }
    });

    if (modernPattern.test(content)) {
      analysis.hasModernFormat = true;
    }

    return analysis;
  }

  async migrateFile(filePath) {
    try {
      this.stats.processed++;
      
      const analysis = await this.analyzeFile(filePath);
      const backupPath = path.join(this.backupDir, path.basename(filePath));
      
      // 创建备份
      fs.copyFileSync(filePath, backupPath);
      
      if (analysis.hasLegacyFormat) {
        this.stats.formats.legacy++;
        
        const newContent = this.convertToModernFormat(analysis);
        
        if (newContent !== analysis.content) {
          fs.writeFileSync(filePath, newContent);
          this.stats.updated++;
          this.log(`✅ 已更新: ${path.basename(filePath)}`, 'success');
        } else {
          this.log(`ℹ️ 无需更新: ${path.basename(filePath)}`, 'info');
        }
      } else if (analysis.hasModernFormat) {
        this.stats.formats.modern++;
        this.log(`ℹ️ 已是现代格式: ${path.basename(filePath)}`, 'info');
      } else {
        this.log(`ℹ️ 无可视化内容: ${path.basename(filePath)}`, 'info');
      }

    } catch (error) {
      this.stats.errors++;
      this.log(`❌ 处理失败: ${filePath} - ${error.message}`, 'error');
    }
  }

  convertToModernFormat(analysis) {
    let content = analysis.content;
    
    // 转换代码块格式
    const conversions = {
      mermaid: (code) => this.createModernChart('mermaid', { code }),
      echarts: (code) => this.createModernChart('echarts', { options: JSON.parse(code) }),
      chartjs: (code) => this.createModernChart('chartjs', { config: JSON.parse(code) }),
      plotly: (code) => this.createModernChart('plotly', JSON.parse(code)),
      d3: (code) => this.createModernChart('d3', { options: JSON.parse(code) }),
      three: (code) => this.createModernChart('three', { options: JSON.parse(code) })
    };

    // 处理每种图表类型
    Object.keys(conversions).forEach(type => {
      const charts = analysis.charts[type].filter(c => c.type === 'legacy');
      
      charts.forEach(chart => {
        try {
          const modernChart = conversions[type](chart.content);
          content = content.substring(0, chart.start) + 
                   modernChart + 
                   content.substring(chart.end);
        } catch (error) {
          this.log(`转换 ${type} 图表失败: ${error.message}`, 'error');
        }
      });
    });

    // 处理内联容器
    content = this.convertInlineContainers(content);

    return content;
  }

  createModernChart(type, config) {
    return `<div class="phoenix-chart-container" data-chart='${JSON.stringify({
      type,
      ...config
    })}'></div>`;
  }

  convertInlineContainers(content) {
    // 转换旧的echarts容器
    content = content.replace(
      /<div class="echarts-container"[^>]*data-option='([^']*)'[^>]*><\/div>/g,
      (match, option) => this.createModernChart('echarts', { options: JSON.parse(option) })
    );

    // 转换旧的chartjs容器
    content = content.replace(
      /<div class="chartjs-container"[^>]*data-config='([^']*)'[^>]*data-type='([^']*)'[^>]*><\/div>/g,
      (match, config, type) => this.createModernChart('chartjs', { type, config: JSON.parse(config) })
    );

    // 转换旧的plotly容器
    content = content.replace(
      /<div class="plotly-chart"[^>]*data-plotly-data='([^']*)'[^>]*data-plotly-layout='([^']*)'[^>]*><\/div>/g,
      (match, data, layout) => this.createModernChart('plotly', { 
        data: JSON.parse(data), 
        layout: JSON.parse(layout) 
      })
    );

    return content;
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: this.stats.processed,
        updatedFiles: this.stats.updated,
        errorFiles: this.stats.errors,
        legacyFormats: this.stats.formats.legacy,
        modernFormats: this.stats.formats.modern
      },
      details: {
        legacyFiles: [],
        modernFiles: [],
        errorFiles: []
      }
    };

    return report;
  }

  async run() {
    try {
      this.log('🚀 开始Phoenix迁移...');
      
      const files = await this.init();
      
      for (const file of files) {
        await this.migrateFile(file);
      }
      
      const report = await this.generateReport();
      
      // 保存报告
      fs.writeFileSync(
        path.join(this.backupDir, 'migration-report.json'),
        JSON.stringify(report, null, 2)
      );
      
      this.log('📊 迁移完成！');
      this.log(`📁 处理文件: ${report.summary.totalFiles}`);
      this.log(`✅ 更新文件: ${report.summary.updatedFiles}`);
      this.log(`❌ 错误文件: ${report.summary.errorFiles}`);
      this.log(`📊 报告已保存: ${this.backupDir}/migration-report.json`);
      
      return report;
      
    } catch (error) {
      this.log(`❌ 迁移失败: ${error.message}`, 'error');
      throw error;
    }
  }

  // 验证迁移结果
  async validate() {
    const reportPath = path.join(this.backupDir, 'migration-report.json');
    
    if (!fs.existsSync(reportPath)) {
      this.log('❌ 未找到迁移报告', 'error');
      return false;
    }
    
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    if (report.summary.errorFiles > 0) {
      this.log(`❌ 发现 ${report.summary.errorFiles} 个错误文件`, 'error');
      return false;
    }
    
    this.log('✅ 迁移验证通过', 'success');
    return true;
  }

  // 回滚功能
  async rollback() {
    const backupFiles = fs.readdirSync(this.backupDir)
      .filter(file => file.endsWith('.md'));
    
    for (const file of backupFiles) {
      const backupPath = path.join(this.backupDir, file);
      const originalPath = path.join(this.postsDir, file);
      
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, originalPath);
        this.log(`✅ 已回滚: ${file}`, 'success');
      }
    }
    
    this.log('🔄 回滚完成', 'success');
  }
}

// CLI接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    postsDir: args.find(arg => arg.startsWith('--posts='))?.split('=')[1] || '_posts',
    backupDir: args.find(arg => arg.startsWith('--backup='))?.split('=')[1] || '_backup'
  };

  const migrator = new PhoenixMigrator(options);

  if (args.includes('--rollback')) {
    migrator.rollback();
  } else if (args.includes('--validate')) {
    migrator.validate();
  } else {
    migrator.run().catch(console.error);
  }
}

module.exports = PhoenixMigrator;
