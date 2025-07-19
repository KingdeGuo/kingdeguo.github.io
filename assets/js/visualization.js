// Unified Visualization Configuration and Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Theme detection for consistent styling
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const themeColors = {
    light: {
      background: '#ffffff',
      primary: '#4a90e2',
      secondary: '#50e3c2',
      text: '#333333',
      grid: '#e0e0e0'
    },
    dark: {
      background: '#1a202c',
      primary: '#81e6d9',
      secondary: '#4fd1c5',
      text: '#f0f0f0',
      grid: '#2d3748'
    }
  };
  const currentTheme = isDark ? themeColors.dark : themeColors.light;

  // Mermaid Configuration and Initialization
  const initMermaid = () => {
    if (window.mermaid) {
      mermaid.initialize({
        startOnLoad: true,
        theme: isDark ? 'dark' : 'default',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        },
        sequence: {
          useMaxWidth: true,
          wrap: true
        },
        gantt: {
          useMaxWidth: true
        },
        journey: {
          useMaxWidth: true
        },
        gitGraph: {
          useMaxWidth: true
        },
        pie: {
          useMaxWidth: true
        },
        er: {
          useMaxWidth: true
        },
        class: {
          useMaxWidth: true
        },
        state: {
          useMaxWidth: true
        }
      });
      
      // 处理所有mermaid代码块
      document.querySelectorAll('pre code.language-mermaid').forEach(block => {
        try {
          const container = document.createElement('div');
          container.className = 'mermaid visualization-container';
          container.textContent = block.textContent;
          block.parentNode.replaceWith(container);
        } catch (error) {
          console.error('Mermaid rendering error:', error);
        }
      });
    }
  };

  // ECharts Configuration and Initialization
  const initECharts = () => {
    document.querySelectorAll('pre code.language-echarts').forEach(block => {
      try {
        const option = JSON.parse(block.textContent);
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '400px';
        container.classList.add('visualization-container', 'echarts-container');
        block.parentNode.replaceWith(container);
        
        const chart = echarts.init(container, isDark ? 'dark' : null);
        // Apply theme colors
        if (option.series) {
          option.series.forEach(series => {
            if (!series.itemStyle) series.itemStyle = {};
            if (!series.itemStyle.color) series.itemStyle.color = currentTheme.primary;
          });
        }
        chart.setOption(option);

        // Handle resize
        window.addEventListener('resize', () => chart.resize());
      } catch (error) {
        console.error('ECharts rendering error:', error);
      }
    });

    // 处理ECharts容器
    document.querySelectorAll('.echarts-container').forEach(container => {
      try {
        const option = JSON.parse(container.dataset.option || '{}');
        const chart = echarts.init(container, isDark ? 'dark' : null);
        chart.setOption(option);
        
        // Handle resize
        window.addEventListener('resize', () => chart.resize());
      } catch (error) {
        console.error('ECharts container rendering error:', error);
      }
    });
  };

  // Chart.js Configuration and Initialization
  const initChartJs = () => {
    // Global Chart.js configuration
    Chart.defaults.color = currentTheme.text;
    Chart.defaults.borderColor = currentTheme.grid;
    Chart.defaults.backgroundColor = currentTheme.background;

    // 处理Chart.js容器
    document.querySelectorAll('.chartjs-container').forEach(el => {
      try {
        const type = el.dataset.type;
        const config = JSON.parse(el.dataset.config || '{}');
        
        // 应用主题颜色
        if (config.data && config.data.datasets) {
          config.data.datasets.forEach(dataset => {
            if (!dataset.backgroundColor) dataset.backgroundColor = currentTheme.primary;
            if (!dataset.borderColor) dataset.borderColor = currentTheme.secondary;
          });
        }
        
        new Chart(el, config);
      } catch (error) {
        console.error('Chart.js rendering error:', error);
      }
    });
  };

  // Plotly.js Configuration and Initialization
  const initPlotly = async () => {
    await window.loadLibrary.plotly();
    
    document.querySelectorAll('.plotly-chart').forEach(container => {
      try {
        const data = JSON.parse(container.dataset.plotlyData || '[]');
        const layout = JSON.parse(container.dataset.plotlyLayout || '{}');
        
        // Apply theme colors
        layout.paper_bgcolor = currentTheme.background;
        layout.plot_bgcolor = currentTheme.background;
        layout.font = { color: currentTheme.text };
        
        Plotly.newPlot(container, data, layout, {
          responsive: true,
          displayModeBar: true
        });
      } catch (error) {
        console.error('Plotly rendering error:', error);
      }
    });
  };

  // D3.js Configuration and Initialization
  const initD3 = async () => {
    await window.loadLibrary.d3();
    
    document.querySelectorAll('.d3-chart').forEach(container => {
      try {
        const width = container.clientWidth;
        const height = container.clientHeight || 400;
        
        const svg = d3.select(container)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .attr('viewBox', [0, 0, width, height]);
          
        // Add D3 visualization code here based on data attributes
        const data = JSON.parse(container.dataset.d3Data || '[]');
        const type = container.dataset.type;
        
        // 根据类型实现不同的D3图表
        if (type === 'bar') {
          // 柱状图实现
          const x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
          
          const y = d3.scaleLinear()
            .range([height, 0]);
          
          x.domain(data.map(d => d.name));
          y.domain([0, d3.max(data, d => d.value)]);
          
          svg.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.name))
            .attr('width', x.bandwidth())
            .attr('y', d => y(d.value))
            .attr('height', d => height - y(d.value))
            .attr('fill', currentTheme.primary);
        }
        // 可以添加更多图表类型
      } catch (error) {
        console.error('D3 rendering error:', error);
      }
    });
  };

  // Three.js Configuration and Initialization
  const initThreeJs = async () => {
    await window.loadLibrary.three();
    
    document.querySelectorAll('.three-js-container').forEach(container => {
      try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Add basic lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);

        // Handle window resize
        window.addEventListener('resize', () => {
          camera.aspect = container.clientWidth / container.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(container.clientWidth, container.clientHeight);
        });

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        };
        animate();
      } catch (error) {
        console.error('Three.js rendering error:', error);
      }
    });
  };

  // Initialize all visualization libraries
  const initVisualizations = () => {
    // 核心库初始化
    initMermaid();
    if (window.echarts) initECharts();
    if (window.Chart) initChartJs();
    
    // 按需初始化可选库
    if (document.querySelector('.plotly-chart')) initPlotly();
    if (document.querySelector('.d3-chart')) initD3();
    if (document.querySelector('.three-js-container')) initThreeJs();
  };

  // Call initialization
  initVisualizations();

  // Handle theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-theme') {
        // 重新初始化Mermaid
        if (window.mermaid) {
          mermaid.initialize({
            theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default'
          });
        }
        // 重新初始化其他图表
        initVisualizations();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
});