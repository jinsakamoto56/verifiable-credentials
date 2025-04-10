let currentCredential = null;

document.getElementById('issueForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const credential = {
        id: document.getElementById('id').value,
        kycStatus: document.getElementById('kycStatus').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        nationality: document.getElementById('nationality').value,
        languages: document.getElementById('languages').value.split(',').map(lang => lang.trim()),
        netWorth: document.getElementById('netWorth').value ? Number(document.getElementById('netWorth').value) : undefined
    };

    try {
        const response = await fetch('/api/credentials/issue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credential)
        });

        if (!response.ok) {
            throw new Error('Failed to issue credential');
        }

        currentCredential = await response.json();
        displayResult(currentCredential);
    } catch (error) {
        displayError(error.message);
    }
});

document.getElementById('presentationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentCredential) {
        displayError('Please issue a credential first');
        return;
    }

    const options = {
        showKycStatus: document.getElementById('showKycStatus').checked,
        showDateOfBirth: document.getElementById('showDateOfBirth').checked,
        showNationality: document.getElementById('showNationality').checked,
        showLanguages: document.getElementById('showLanguages').checked,
        showNetWorth: document.getElementById('showNetWorth').checked,
        agePredicate: document.getElementById('agePredicate').value ? Number(document.getElementById('agePredicate').value) : undefined,
        netWorthPredicate: document.getElementById('netWorthPredicate').value ? Number(document.getElementById('netWorthPredicate').value) : undefined
    };

    try {
        const response = await fetch('/api/credentials/present', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                credential: currentCredential,
                options
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create presentation');
        }

        const presentation = await response.json();
        displayResult(presentation);
    } catch (error) {
        displayError(error.message);
    }
});

document.getElementById('verifyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const credentialText = document.getElementById('credentialToVerify').value;
    let credential;
    
    try {
        credential = JSON.parse(credentialText);
    } catch (error) {
        displayVerificationResult(false, ['Invalid JSON format']);
        return;
    }

    try {
        const response = await fetch('/api/credentials/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credential)
        });

        if (!response.ok) {
            throw new Error('Failed to verify credential');
        }

        const result = await response.json();
        displayVerificationResult(result.verified, result.errors);
    } catch (error) {
        displayVerificationResult(false, [error.message]);
    }
});

function displayResult(data) {
    const resultElement = document.getElementById('result');
    resultElement.textContent = JSON.stringify(data, null, 2);
    resultElement.classList.remove('text-danger');
}

function displayError(message) {
    const resultElement = document.getElementById('result');
    resultElement.textContent = message;
    resultElement.classList.add('text-danger');
}

function displayVerificationResult(verified, errors) {
    const resultElement = document.getElementById('verificationResult');
    resultElement.className = 'verification-result ' + (verified ? 'verified' : 'not-verified');
    
    if (verified) {
        resultElement.innerHTML = '<strong>✓ Credential Verified</strong>';
    } else {
        let html = '<strong>✗ Credential Not Verified</strong>';
        if (errors && errors.length > 0) {
            html += '<ul class="error-list">';
            errors.forEach(error => {
                html += `<li>${error}</li>`;
            });
            html += '</ul>';
        }
        resultElement.innerHTML = html;
    }
} 