document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    const resultCard = document.getElementById('result-card');
    const predictedCostText = document.getElementById('predicted-cost');
    const riskLevelBadge = document.getElementById('risk-level');
    const formError = document.getElementById('form-error');
    const errorText = document.getElementById('form-error-text');
    const submitBtn = document.getElementById('submit-btn');
    const btnSpan = submitBtn.querySelector('span');
    const btnIcon = submitBtn.querySelector('i');

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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        clearErrors();
        resultCard.classList.add('hidden');

        const ageInput = document.getElementById('age');
        const sexInput = document.getElementById('sex'); // Now a hidden input
        const bmiInput = document.getElementById('bmi');
        const childrenInput = document.getElementById('children'); // Now a select dropping down numbers
        const smokerInput = document.getElementById('smoker'); // Now a hidden input
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

            resultCard.classList.remove('hidden');
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
