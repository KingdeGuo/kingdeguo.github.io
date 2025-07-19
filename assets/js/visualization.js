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

  // ECharts Configuration and Initialization
  const initECharts = () => {
    document.querySelectorAll('pre code.language-echarts').forEach(block => {
      try {
        const option = JSON.parse(block.textContent);
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '400px';
        container.classList.add('visualization-container');
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
  };

  // Chart.js Configuration and Initialization
  const initChartJs = () => {
    // Global Chart.js configuration
    Chart.defaults.color = currentTheme.text;
    Chart.defaults.borderColor = currentTheme.grid;
    Chart.defaults.backgroundColor = currentTheme.background;

    // Custom UML plugin
    Chart.register({
      id: 'umlPlugin',
      beforeDraw: (chart) => {
        const { ctx, data } = chart;
        ctx.save();
        // Add custom UML rendering logic here
      }
    });

    // Initialize UML charts
    document.querySelectorAll('.uml-chart').forEach(el => {
      try {
        const type = el.dataset.type;
        const config = JSON.parse(el.dataset.config);
        new Chart(el, config);
      } catch (error) {
        console.error('Chart.js UML rendering error:', error);
      }
    });
  };

  // Three.js Configuration and Initialization
  const initThreeJs = () => {
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

  // Plotly.js Configuration and Initialization
  const initPlotly = () => {
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
  const initD3 = () => {
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
        // Implement specific D3 chart types based on container.dataset.type
      } catch (error) {
        console.error('D3 rendering error:', error);
      }
    });
  };

  // Initialize all visualization libraries
  const initVisualizations = () => {
    if (window.echarts) initECharts();
    if (window.Chart) initChartJs();
    if (window.THREE) initThreeJs();
    if (window.Plotly) initPlotly();
    if (window.d3) initD3();
  };

  // Call initialization
  initVisualizations();

  // Handle theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-theme') {
        initVisualizations();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
});