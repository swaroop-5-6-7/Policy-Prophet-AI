document.addEventListener('DOMContentLoaded', () => {
    // ---- View Navigation ----
    const landingView = document.getElementById('landing-view');
    const appView = document.getElementById('app-view');
    const navGetStarted = document.getElementById('nav-get-started');
    const heroGetStarted = document.getElementById('hero-get-started');
    const backBtn = document.getElementById('back-btn');

    function showApp() {
        landingView.classList.add('hidden');
        appView.classList.remove('hidden');
    }

    function showLanding() {
        appView.classList.add('hidden');
        landingView.classList.remove('hidden');
    }

    navGetStarted.addEventListener('click', showApp);
    heroGetStarted.addEventListener('click', showApp);
    backBtn.addEventListener('click', showLanding);

    // ---- Theme Toggle ----
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
        
        // Update Chart if it exists
        if (chartInstance) {
            updateChartTheme();
        }
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    function updateChartTheme() {
        const style = getComputedStyle(document.documentElement);
        const surfaceContainer = style.getPropertyValue('--surface-container').trim();
        const primary = style.getPropertyValue('--primary').trim();
        const secondary = style.getPropertyValue('--secondary').trim();
        const inversePrimary = style.getPropertyValue('--on-primary-fixed-variant').trim();
        const gridColor = style.getPropertyValue('--surface-container-high').trim();

        chartInstance.data.datasets[0].backgroundColor = [
            surfaceContainer,
            inversePrimary,
            secondary
        ];
        chartInstance.options.scales.y.grid.color = gridColor;
        chartInstance.update();
    }

    // ---- Hero Text Animation ----
    const heroHeading = document.querySelector('.hero h1');
    if (heroHeading) {
        const text = heroHeading.textContent;
        heroHeading.textContent = '';
        let globalIndex = 0;
        
        text.split(' ').forEach(word => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';
            
            word.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.className = 'letter-anim';
                // 80ms staggered delay
                charSpan.style.animationDelay = `${globalIndex * 80}ms`;
                wordSpan.appendChild(charSpan);
                globalIndex++;
            });
            
            heroHeading.appendChild(wordSpan);
            heroHeading.appendChild(document.createTextNode(' '));
            globalIndex++;
        });
    }

    // ---- Form Elements ----
    const form = document.getElementById('prediction-form');
    const resultEmptyState = document.getElementById('result-empty-state');
    const resultContentState = document.getElementById('result-content-state');
    const predictedCostText = document.getElementById('predicted-cost');
    const riskLevelBadge = document.getElementById('risk-level');
    const formError = document.getElementById('form-error');
    const errorText = document.getElementById('form-error-text');
    const submitBtn = document.getElementById('submit-btn');
    const btnSpan = submitBtn.querySelector('span');
    const btnIcon = submitBtn.querySelector('i');
    
    let chartInstance = null;

    // Handle toggle buttons logic
    const toggles = document.querySelectorAll('.toggle-btn');
    toggles.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parent = e.target.closest('.toggle-group');
            // Remove active class from siblings
            parent.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            e.target.classList.add('active');
            
            // Update the hidden input that follows the toggle group
            const hiddenInput = parent.nextElementSibling;
            if(hiddenInput && hiddenInput.tagName === 'INPUT') {
                hiddenInput.value = e.target.getAttribute('data-value');
                hiddenInput.classList.remove('error-input');
                formError.classList.add('hidden');
            }
        });
    });

    const inputsToValidate = form.querySelectorAll('input[type="number"], select, input[type="hidden"]');

    function clearErrors() {
        formError.classList.add('hidden');
        inputsToValidate.forEach(input => {
            input.classList.remove('error-input');
            // If hidden input for toggle, add error style to its toggle-group instead
            if (input.type === 'hidden') {
                input.previousElementSibling.style.border = 'none';
            }
        });
    }

    function setError(inputElement) {
        if (inputElement.type === 'hidden') {
            inputElement.previousElementSibling.style.border = '1px solid #ef4444';
            inputElement.previousElementSibling.style.borderRadius = '6px';
        } else {
            inputElement.classList.add('error-input');
        }
    }

    function renderChart(predictedCost) {
        const ctx = document.getElementById('analysisChart').getContext('2d');
        if (chartInstance) {
            chartInstance.destroy();
        }

        // Mock market data compared to user's estimate
        const nationalAvg = 18500;
        const geoAvg = predictedCost * 1.15; // slightly higher logic to make user feel good

        const style = getComputedStyle(document.documentElement);
        const surfaceContainer = style.getPropertyValue('--surface-container').trim();
        const secondary = style.getPropertyValue('--secondary').trim();
        const inversePrimary = style.getPropertyValue('--on-primary-fixed-variant').trim();
        const gridColor = style.getPropertyValue('--surface-container-high').trim();

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['National Avg', 'Regional Cohort', 'Your Estimate'],
                datasets: [{
                    label: 'Annual Premium (₹)',
                    data: [nationalAvg, geoAvg, predictedCost],
                    backgroundColor: [
                        surfaceContainer,
                        inversePrimary,
                        secondary
                    ],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        grid: { color: gridColor }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        clearErrors();

        const ageInput = document.getElementById('age');
        const sexInput = document.getElementById('sex'); 
        const bmiInput = document.getElementById('bmi');
        const childrenInput = document.getElementById('children'); 
        const smokerInput = document.getElementById('smoker'); 
        const regionInput = document.getElementById('region');

        let isValid = true;
        
        [ageInput, sexInput, bmiInput, childrenInput, smokerInput, regionInput].forEach(el => {
            if (!el.value) {
                isValid = false;
                setError(el);
            }
        });

        if (!isValid) {
            errorText.textContent = 'Please fill out all required fields.';
            formError.classList.remove('hidden');
            return;
        }

        const age = parseFloat(ageInput.value);
        const bmi = parseFloat(bmiInput.value);
        const children = parseInt(childrenInput.value, 10);

        if (isNaN(age) || age < 0 || isNaN(bmi) || bmi <= 0 || isNaN(children) || children < 0) {
            if (isNaN(age) || age < 0) setError(ageInput);
            if (isNaN(bmi) || bmi <= 0) setError(bmiInput);
            if (isNaN(children) || children < 0) setError(childrenInput);
            
            errorText.textContent = 'Please enter valid numbers.';
            formError.classList.remove('hidden');
            return;
        }

        const formData = {
            age: age,
            sex: sexInput.value,
            bmi: bmi,
            children: children,
            smoker: smokerInput.value,
            region: regionInput.value
        };

        try {
            // Loading state
            submitBtn.classList.add('loading');
            btnSpan.textContent = 'Analyzing...';
            btnIcon.className = 'fa-solid fa-spinner fa-spin';
            submitBtn.disabled = true;

            const API_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' 
                ? 'http://127.0.0.1:5000/predict' 
                : '/predict';

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('API Request Failed');
            }

            const result = await response.json();
            const cost = result.predicted_cost;

            predictedCostText.textContent = `₹${cost.toLocaleString('en-IN')}`;

            // Reset classes
            riskLevelBadge.className = 'risk-badge';
            
            if (cost < 10000) {
                riskLevelBadge.textContent = "Low Risk";
                riskLevelBadge.classList.add('risk-low');
            } else if (cost < 20000) {
                riskLevelBadge.textContent = "Medium Risk";
                riskLevelBadge.classList.add('risk-med');
            } else {
                riskLevelBadge.textContent = "High Risk";
                riskLevelBadge.classList.add('risk-high');
            }

            // Move Stepper
            document.getElementById('step-2').classList.remove('inactive');
            document.getElementById('step-2').classList.add('active');

            // Show Results pane instead of empty state
            resultEmptyState.classList.add('hidden');
            resultContentState.classList.remove('hidden');
            
            // Draw visualization
            renderChart(cost);

        } catch (error) {
            console.error('Error fetching prediction:', error);
            errorText.textContent = 'An error occurred while connecting to the server. Make sure API is running.';
            formError.classList.remove('hidden');
        } finally {
            submitBtn.classList.remove('loading');
            btnSpan.textContent = 'Analyze & Predict';
            btnIcon.className = 'fa-solid fa-arrow-trend-up';
            submitBtn.disabled = false;
        }
    });

    inputsToValidate.forEach(input => {
        if(input.type !== 'hidden') {
            input.addEventListener('input', () => {
                input.classList.remove('error-input');
                if (form.querySelectorAll('.error-input').length === 0) {
                    formError.classList.add('hidden');
                }
            });
            
            input.addEventListener('change', () => {
                input.classList.remove('error-input');
                if (form.querySelectorAll('.error-input').length === 0) {
                    formError.classList.add('hidden');
                }
            });
        }
    });
});
