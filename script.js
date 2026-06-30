
document.addEventListener('DOMContentLoaded', () => {
  
  // Elements
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Light/Dark Theme Toggle
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    body.classList.add('dark-theme');
    themeToggle.checked = true;
  } else {
    body.classList.remove('dark-theme');
    themeToggle.checked = false;
  }

  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
    updateChartTheme();
  });


  // Interactive Shipment Analytics Chart
  const chartCanvas = document.getElementById('shipmentChart');
  const dateSelect = document.getElementById('date-range-select');
  const statTotal = document.getElementById('stat-total');
  const statActive = document.getElementById('stat-active');
  
  const chartDataSets = {
    'jan-may': {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      values: [180, 420, 290, 680, 510],
      total: '200,783',
      active: '2,163'
    },
    'jun-oct': {
      labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      values: [520, 610, 390, 780, 890],
      total: '248,192',
      active: '3,410'
    },
    'nov-dec': {
      labels: ['Nov', 'Dec'],
      values: [740, 1080],
      total: '112,044',
      active: '1,802'
    }
  };

  let currentChart = null;

  function getThemeColors() {
    const isDark = body.classList.contains('dark-theme');
    return {
      barColor: isDark ? '#ffffff' : '#111111',
      trackColor: isDark ? '#1c1d28' : '#eef1f6', // background track bar color
      gridColor: isDark ? '#1c1d28' : '#eef1f6',
      textColor: isDark ? '#6b7280' : '#888888'
    };
  }

  function initChart(rangeKey) {
    const colors = getThemeColors();
    const dataSet = chartDataSets[rangeKey];
    
    statTotal.textContent = dataSet.total;
    statActive.textContent = dataSet.active;

    if (currentChart) {
      currentChart.destroy();
    }

    // Static ceiling/track limit for background track rendering
    const maxVal = 1200;
    const trackValues = Array(dataSet.values.length).fill(maxVal);

    currentChart = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: dataSet.labels,
        datasets: [
          // Dataset 0: Gray Background Track
          {
            data: trackValues,
            backgroundColor: colors.trackColor,
            borderRadius: 12,
            borderSkipped: false,
            barThickness: 20,
            order: 2
          },
          // Dataset 1: Actual Active Data Bar (Overlayed)
          {
            data: dataSet.values,
            backgroundColor: colors.barColor,
            borderRadius: 12,
            borderSkipped: false,
            barThickness: 20,
            order: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            titleFont: { family: 'Outfit', size: 12, weight: '600' },
            bodyFont: { family: 'Inter', size: 12 },
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              // Ensure we only show tooltips for the actual data series, not the track background
              label: function(context) {
                if (context.datasetIndex === 0) return null;
                return `Shipments: ${context.parsed.y}`;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true, // stacked scale overlay
            grid: { display: false },
            ticks: {
              color: colors.textColor,
              font: { family: 'Inter', size: 11, weight: '600' }
            },
            border: { display: false }
          },
          y: {
            stacked: false,
            grid: { color: colors.gridColor, drawBorder: false },
            ticks: {
              color: colors.textColor,
              font: { family: 'Inter', size: 11 },
              callback: function(value) {
                if (value === 0) return '0';
                if (value >= 1000) return (value / 1000) + 'k';
                return value;
              }
            },
            border: { display: false }
          }
        }
      }
    });
  }

  function updateChartTheme() {
    if (!currentChart) return;
    const colors = getThemeColors();
    
    // Dataset 0: background track bar
    currentChart.data.datasets[0].backgroundColor = colors.trackColor;
    // Dataset 1: active data bar
    currentChart.data.datasets[1].backgroundColor = colors.barColor;
    
    currentChart.options.scales.x.ticks.color = colors.textColor;
    currentChart.options.scales.y.grid.color = colors.gridColor;
    currentChart.options.scales.y.ticks.color = colors.textColor;
    currentChart.update();
  }

  initChart('jan-may');

  dateSelect.addEventListener('change', (e) => {
    initChart(e.target.value);
  });


  // 3. Shipping Options 3D Stacked Card Deck
  const deckCards = document.querySelectorAll('.deck-card');
  const deckButtons = document.querySelectorAll('.deck-btn');
  const deckCardTabs = document.querySelectorAll('.deck-card-tab');
  const detailsArea = document.querySelector('.deck-details-area');
  const deckDesc = document.getElementById('deck-desc');

  const shippingDetails = {
    1: {
      desc: 'Optimized road and rail freight networks spanning continents, ensuring reliable, door-to-door ground cargo container delivery.'
    },
    2: {
      desc: 'Global express air transportation services designed for time-critical cargo with high priority handling and tracking.'
    },
    3: {
      desc: 'Reliable and cost-effective for large shipments across oceans, ensuring global reach and timely cargo container delivery.'
    }
  };

  // Rotate deck function to reassign stack position classes
  function rotateDeck(activeIndex) {
    deckCards.forEach(card => {
      const cardIndex = parseInt(card.getAttribute('data-index'), 10);
      
      // Clear previous classes
      card.classList.remove('card-front', 'card-middle', 'card-back');
      
      // Determine cyclic layout depth
      if (cardIndex === activeIndex) {
        card.classList.add('card-front');
      } else if (
        (activeIndex === 3 && cardIndex === 2) || 
        (activeIndex === 2 && cardIndex === 3) ||
        (activeIndex === 1 && cardIndex === 2)
      ) {
        card.classList.add('card-middle');
      } else {
        card.classList.add('card-back');
      }
    });

    // Update active control button
    deckButtons.forEach(btn => {
      const btnIndex = parseInt(btn.getAttribute('data-index'), 10);
      if (btnIndex === activeIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Transition detail text below the deck
    detailsArea.style.opacity = '0';
    detailsArea.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      deckDesc.textContent = shippingDetails[activeIndex].desc;
      detailsArea.style.opacity = '1';
      detailsArea.style.transform = 'translateY(0)';
    }, 200);
  }

  // Bind click event to controls/pills
  deckButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      rotateDeck(idx);
    });
  });

  // Bind click event to card tabs peeking from behind
  deckCardTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentCard = tab.closest('.deck-card');
      const idx = parseInt(parentCard.getAttribute('data-index'), 10);
      rotateDeck(idx);
    });
  });


  //  Request A Quote Modal

  const quoteModal = document.getElementById('quote-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const quoteForm = document.getElementById('quote-form');
  const successMessage = document.getElementById('success-message');
  const successCloseBtn = document.getElementById('success-close-btn');

  // Open Modal (delegated selector click handler)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.quote-trigger');
    if (trigger) {
      e.preventDefault();
      
      const selectMethod = document.getElementById('shipping-method');
      const activeBtn = document.querySelector('.deck-btn.active');
      
      if (activeBtn) {
        const btnIndex = activeBtn.getAttribute('data-index');
        if (btnIndex === '1') selectMethod.value = 'land';
        else if (btnIndex === '2') selectMethod.value = 'air';
        else selectMethod.value = 'sea';
      }
      
      quoteModal.classList.add('active');
    }
  });

  // Close Modal
  modalCloseBtn.addEventListener('click', closeModal);
  
  quoteModal.addEventListener('click', (e) => {
    if (e.target === quoteModal) {
      closeModal();
    }
  });

  successCloseBtn.addEventListener('click', closeModal);

  function closeModal() {
    quoteModal.classList.remove('active');
    setTimeout(() => {
      quoteForm.style.display = 'flex';
      successMessage.style.display = 'none';
      quoteForm.reset();
    }, 300);
  }

  // Handle Form Submission
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = quoteForm.querySelector('.submit-btn');
    const submitBtnText = submitBtn.querySelector('span');
    const originalText = submitBtnText.textContent;
    
    submitBtn.disabled = true;
    submitBtnText.textContent = 'Submitting...';

    setTimeout(() => {
      quoteForm.style.display = 'none';
      successMessage.style.display = 'flex';
      submitBtn.disabled = false;
      submitBtnText.textContent = originalText;
    }, 1200);
  });

});
