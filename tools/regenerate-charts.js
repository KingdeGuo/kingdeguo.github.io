#!/usr/bin/env node
/**
 * 图表重新生成工具
 * 将所有博客中的旧图表系统更新为新的reliable-visualization系统
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = '_posts';
const BACKUP_DIR = '_backup/charts-regeneration';

// 确保备份目录存在
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// 图表类型映射
const CHART_MAPPINGS = {
    'phoenix-chart-container': 'reliable-chart-container',
    'data-chart': 'data-chart'
};

// 需要处理的文件
const POSTS = [
    '2025-07-13-github-pages-blog-tutorial.md',
    '2025-07-14-intro-to-llm-agent-hr.md',
    '2025-07-16-enterprise-knowledge-base-llm.md',
    '2025-07-16-introduction-to-value-investing.md',
    '2025-07-17-deep-dive-into-langchain.md',
    '2025-07-18-demystifying-llm-memory.md',
    '2025-07-18-quantitative-investment-guide-v2.md',
    '2025-07-18-quantitative-investment-guide.md',
    '2025-07-19-高效时间管理指南.md'
];

function backupFile(filePath) {
    const filename = path.basename(filePath);
    const backupPath = path.join(BACKUP_DIR, `${filename}.${Date.now()}.bak`);
    fs.copyFileSync(filePath, backupPath);
    console.log(`备份创建: ${backupPath}`);
}

function updateChartContainers(content) {
    // 替换旧的phoenix-chart-container为新的reliable-chart-container
    let updated = content.replace(
        /<div class="phoenix-chart-container"/g,
        '<div class="reliable-chart-container"'
    );

    // 确保所有图表都有正确的data-chart属性
    updated = updated.replace(
        /data-chart='([^']*)'/g,
        (match, config) => {
            try {
                const parsed = JSON.parse(config.replace(/'/g, '"'));
                if (parsed.type === 'mermaid' && !parsed.config) {
                    parsed.config = {
                        theme: 'default',
                        flowchart: { useMaxWidth: true, htmlLabels: true },
                        sequence: { useMaxWidth: true, wrap: true }
                    };
                }
                return `data-chart='${JSON.stringify(parsed)}'`;
            } catch (e) {
                console.warn('解析图表配置失败:', e);
                return match;
            }
        }
    );

    return updated;
}

function validateChartSyntax(content) {
    // 检查mermaid图表语法
    const mermaidRegex = /data-chart='([^']*mermaid[^']*)'/g;
    let match;
    const issues = [];

    while ((match = mermaidRegex.exec(content)) !== null) {
        try {
            const config = JSON.parse(match[1].replace(/'/g, '"'));
            if (config.type === 'mermaid' && !config.code) {
                issues.push('缺少mermaid代码');
            }
        } catch (e) {
            issues.push(`JSON解析错误: ${e.message}`);
        }
    }

    return issues;
}

function processPost(filename) {
    const filePath = path.join(POSTS_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
        console.warn(`文件不存在: ${filePath}`);
        return;
    }

    console.log(`\n处理文件: ${filename}`);
    
    // 创建备份
    backupFile(filePath);
    
    // 读取内容
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 更新图表容器
    const updatedContent = updateChartContainers(content);
    
    // 验证图表语法
    const issues = validateChartSyntax(updatedContent);
    if (issues.length > 0) {
        console.warn(`图表语法问题:`, issues);
    }
    
    // 写入更新后的内容
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    
    // 统计信息
    const originalCount = (content.match(/phoenix-chart-container/g) || []).length;
    const updatedCount = (updatedContent.match(/reliable-chart-container/g) || []).length;
    
    console.log(`✅ 完成: ${filename}`);
    console.log(`   原始图表: ${originalCount}`);
    console.log(`   更新图表: ${updatedCount}`);
}

function generateReport() {
    const report = {
        timestamp: new Date().toISOString(),
        processedFiles: [],
        totalCharts: 0,
        errors: []
    };

    POSTS.forEach(filename => {
        const filePath = path.join(POSTS_DIR, filename);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const chartCount = (content.match(/reliable-chart-container/g) || []).length;
            
            report.processedFiles.push({
                filename,
                chartCount,
                status: 'success'
            });
            
            report.totalCharts += chartCount;
        } else {
            report.errors.push({
                filename,
                error: '文件不存在'
            });
        }
    });

    const reportPath = path.join(BACKUP_DIR, 'regeneration-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    return report;
}

// 主执行函数
function main() {
    console.log('🔄 开始重新生成图表...\n');
    
    POSTS.forEach(processPost);
    
    const report = generateReport();
    
    console.log('\n📊 处理完成！');
    console.log(`📁 总文件数: ${report.processedFiles.length}`);
    console.log(`📈 总图表数: ${report.totalCharts}`);
    console.log(`💾 备份目录: ${BACKUP_DIR}`);
    
    if (report.errors.length > 0) {
        console.log('\n⚠️ 错误:');
        report.errors.forEach(error => console.log(`   ${error.filename}: ${error.error}`));
    }
}

// 执行
if (require.main === module) {
    main();
}

module.exports = {
    processPost,
    updateChartContainers,
    validateChartSyntax
};
