#!/usr/bin/env node
/**
 * 图表验证工具
 * 验证所有博客中的图表是否正确配置和可渲染
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = '_posts';
const VALIDATION_REPORT = '_backup/charts-regeneration/validation-report.json';

// 图表类型验证规则
const CHART_VALIDATION_RULES = {
    mermaid: {
        requiredFields: ['type', 'code'],
        optionalFields: ['config', 'theme']
    },
    chartjs: {
        requiredFields: ['type', 'options'],
        optionalFields: ['data', 'config']
    },
    plotly: {
        requiredFields: ['type', 'data', 'layout'],
        optionalFields: ['config']
    },
    echarts: {
        requiredFields: ['type', 'options'],
        optionalFields: ['config']
    }
};

function validateChartConfig(config, chartType) {
    const rules = CHART_VALIDATION_RULES[chartType];
    if (!rules) {
        return { valid: false, errors: [`未知的图表类型: ${chartType}`] };
    }

    const errors = [];
    
    // 检查必需字段
    rules.requiredFields.forEach(field => {
        if (!config[field]) {
            errors.push(`缺少必需字段: ${field}`);
        }
    });

    // 检查字段类型
    if (chartType === 'mermaid' && config.code && typeof config.code !== 'string') {
        errors.push('mermaid code必须是字符串');
    }

    if (chartType === 'chartjs' && config.options && typeof config.options !== 'object') {
        errors.push('chartjs options必须是对象');
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings: []
    };
}

function extractChartConfigs(content) {
    const configs = [];
    const regex = /<div class="reliable-chart-container" data-chart='([^']*)'/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
        try {
            const config = JSON.parse(match[1].replace(/'/g, '"'));
            configs.push({
                raw: match[1],
                parsed: config,
                position: match.index
            });
        } catch (e) {
            configs.push({
                raw: match[1],
                error: `JSON解析失败: ${e.message}`,
                position: match.index
            });
        }
    }

    return configs;
}

function validatePost(filename) {
    const filePath = path.join(POSTS_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
        return {
            filename,
            status: 'error',
            error: '文件不存在'
        };
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const charts = extractChartConfigs(content);
    
    const validation = {
        filename,
        status: 'success',
        totalCharts: charts.length,
        charts: [],
        errors: [],
        warnings: []
    };

    charts.forEach((chart, index) => {
        if (chart.error) {
            validation.errors.push({
                chartIndex: index,
                type: 'parse_error',
                message: chart.error,
                position: chart.position
            });
            return;
        }

        const { parsed } = chart;
        const typeValidation = validateChartConfig(parsed, parsed.type);
        
        validation.charts.push({
            index,
            type: parsed.type,
            valid: typeValidation.valid,
            errors: typeValidation.errors,
            warnings: typeValidation.warnings,
            config: parsed
        });

        if (!typeValidation.valid) {
            validation.errors.push(...typeValidation.errors.map(err => ({
                chartIndex: index,
                type: 'validation_error',
                message: err
            })));
        }
    });

    if (validation.errors.length > 0) {
        validation.status = 'error';
    }

    return validation;
}

function generateValidationReport() {
    const posts = fs.readdirSync(POSTS_DIR)
        .filter(file => file.endsWith('.md'))
        .filter(file => !file.startsWith('.'));

    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalPosts: posts.length,
            totalCharts: 0,
            validCharts: 0,
            invalidCharts: 0,
            errors: []
        },
        details: []
    };

    posts.forEach(filename => {
        const validation = validatePost(filename);
        report.details.push(validation);
        
        // 更新统计信息
        report.summary.totalCharts += validation.totalCharts;
        
        const validCharts = validation.charts.filter(c => c.valid).length;
        const invalidCharts = validation.charts.filter(c => !c.valid).length;
        
        report.summary.validCharts += validCharts;
        report.summary.invalidCharts += invalidCharts;
        
        if (validation.errors.length > 0) {
            report.summary.errors.push({
                filename,
                errors: validation.errors
            });
        }
    });

    // 保存报告
    fs.writeFileSync(VALIDATION_REPORT, JSON.stringify(report, null, 2));
    
    return report;
}

function printReport(report) {
    console.log('\n📊 图表验证报告');
    console.log('================');
    console.log(`📁 总文件数: ${report.summary.totalPosts}`);
    console.log(`📈 总图表数: ${report.summary.totalCharts}`);
    console.log(`✅ 有效图表: ${report.summary.validCharts}`);
    console.log(`❌ 无效图表: ${report.summary.invalidCharts}`);
    
    if (report.summary.errors.length > 0) {
        console.log('\n⚠️ 发现的问题:');
        report.summary.errors.forEach(error => {
            console.log(`\n📄 ${error.filename}:`);
            error.errors.forEach(err => {
                console.log(`   - ${err.message}`);
            });
        });
    }
    
    console.log(`\n📋 详细报告: ${VALIDATION_REPORT}`);
}

// 主执行函数
function main() {
    console.log('🔍 开始验证图表配置...\n');
    
    const report = generateValidationReport();
    printReport(report);
    
    // 返回退出码
    process.exit(report.summary.invalidCharts > 0 ? 1 : 0);
}

// 执行
if (require.main === module) {
    main();
}

module.exports = {
    validatePost,
    validateChartConfig,
    extractChartConfigs
};
