// ==========================================================================
// MatriVal™ Matrimonial Valuation Logic & Web Interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Selectors ---
  const valuationForm = document.getElementById('valuation-form');
  const wizardCard = document.getElementById('wizard-card');
  const loadingCard = document.getElementById('loading-card');
  const loadingLogs = document.getElementById('loading-logs');
  const resultDashboard = document.getElementById('result-dashboard');
  
  // Navigation Buttons
  const nextBtns = document.querySelectorAll('.next-step');
  const prevBtns = document.querySelectorAll('.prev-step');
  const calculateBtn = document.getElementById('calculate-btn');
  
  // Step 1 Inputs (Identity)
  const profileNameInput = document.getElementById('profile-name');
  
  // Step 2 Inputs (Pedigree)
  const incomeInput = document.getElementById('groom-income');
  
  // Step 3 Inputs (Specs)
  const heightInput = document.getElementById('groom-height');
  const heightDisplay = document.getElementById('height-display');
  const heightComment = document.getElementById('height-comment');
  const ageInput = document.getElementById('groom-age');
  const ageDisplay = document.getElementById('age-display');
  const ageComment = document.getElementById('age-comment');
  
  // Result Outputs
  const receiptTypeTitle = document.getElementById('receipt-type-title');
  const receiptAmountLabel = document.getElementById('receipt-amount-label');
  const receiptTotalValue = document.getElementById('receipt-total-value');
  const receiptAmountText = document.getElementById('receipt-amount-text');
  const receiptBreakdown = document.getElementById('receipt-breakdown');
  const receiptAssetsKind = document.getElementById('receipt-assets-kind');
  
  // Sharing Buttons
  const shareWhatsappBtn = document.getElementById('share-whatsapp-btn');
  const shareTwitterBtn = document.getElementById('share-twitter-btn');

  // --- State Variables ---
  let currentStep = 1;
  let estimatedValuation = 0;
  let userName = '';
  let userGender = 'male';

  // --- Real-time Ticker Updates ---
  const tickerTrack = document.getElementById('ticker-track');
  if (tickerTrack) {
    const clonedTrackContent = tickerTrack.innerHTML;
    tickerTrack.innerHTML += ' &nbsp;&nbsp;&nbsp;&nbsp; ' + clonedTrackContent;
  }

  // --- Input Change Handlers ---

  // Height slider
  heightInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    const feet = Math.floor(val);
    const inches = Math.round((val - feet) * 12);
    heightDisplay.textContent = `${feet}'${inches}"`;
    
    // Satirical height remarks
    if (val < 5.4) {
      heightComment.textContent = "Below demographic height benchmark (potential profile depreciation).";
      heightComment.style.color = "var(--color-danger)";
    } else if (val >= 5.4 && val < 5.8) {
      heightComment.textContent = "Standard average tier. Neutral rating impact.";
      heightComment.style.color = "var(--color-text-muted)";
    } else if (val >= 5.8 && val < 6.0) {
      heightComment.textContent = "Above-average height. Strong rating boost.";
      heightComment.style.color = "var(--color-accent)";
    } else {
      heightComment.textContent = "Premium height class. Max height multiplier applied.";
      heightComment.style.color = "var(--color-accent)";
    }
  });

  // Age slider
  ageInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    ageDisplay.textContent = `${val} Years`;
    
    if (val >= 21 && val <= 25) {
      ageComment.textContent = "Early-career index. High profile demand window.";
      ageComment.style.color = "var(--color-accent)";
    } else if (val >= 26 && val <= 30) {
      ageComment.textContent = "Optimal marriage age bracket.";
      ageComment.style.color = "var(--color-primary)";
    } else if (val >= 31 && val <= 35) {
      ageComment.textContent = "Mid-career status. Standard age coefficient.";
      ageComment.style.color = "var(--color-text-muted)";
    } else {
      ageComment.textContent = "Profile depreciation due to late-marriage age bias.";
      ageComment.style.color = "var(--color-danger)";
    }
  });

  // --- Form Wizard Navigation ---
  
  const updateWizardProgressBar = () => {
    const percent = ((currentStep - 1) / 3) * 100;
    document.getElementById('progress-line-fill').style.width = `${percent}%`;
    
    for (let i = 1; i <= 4; i++) {
      const indicator = document.getElementById(`step-ind-${i}`);
      if (i < currentStep) {
        indicator.classList.add('completed');
        indicator.classList.remove('active');
      } else if (i === currentStep) {
        indicator.classList.add('active');
        indicator.classList.remove('completed');
      } else {
        indicator.classList.remove('active', 'completed');
      }
    }
  };

  const showStep = (step) => {
    document.querySelectorAll('.wizard-step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');
    currentStep = step;
    updateWizardProgressBar();
  };

  nextBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const nextStep = parseInt(e.target.dataset.next);
      
      // Validation for Step 1
      if (currentStep === 1) {
        const nameVal = profileNameInput.value.trim();
        if (!nameVal) {
          alert("Please enter your name to initialize the profile!");
          profileNameInput.focus();
          return;
        }
        userName = nameVal;
        userGender = document.querySelector('input[name="profile-gender"]:checked').value;
      }
      
      // Validation for Step 2
      if (currentStep === 2) {
        const edu = document.getElementById('groom-education').value;
        const job = document.getElementById('groom-job').value;
        const incomeVal = incomeInput.value;
        
        if (!edu || !job || incomeVal === '') {
          alert("Please fill in Education, Career, and Annual Income fields first!");
          return;
        }
      }
      
      showStep(nextStep);
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prevStep = parseInt(e.target.dataset.prev);
      showStep(prevStep);
    });
  });

  // --- Calculation & Reveal Process ---
  
  calculateBtn.addEventListener('click', () => {
    const edu = document.getElementById('groom-education').value;
    const job = document.getElementById('groom-job').value;
    const incomeVal = incomeInput.value;
    const skinSelected = document.querySelector('input[name="groom-tone"]:checked');
    
    if (!edu || !job || incomeVal === '' || !skinSelected) {
      alert("Please complete all sections before calculating.");
      return;
    }
    
    // Hide wizard, show loading state
    wizardCard.classList.add('hidden');
    loadingCard.classList.remove('hidden');
    
    // Run auditing logs simulation
    runLoadingAnimation(() => {
      loadingCard.classList.add('hidden');
      resultDashboard.classList.remove('hidden');
      computeAndRenderValuation();
    });
  });

  const runLoadingAnimation = (callback) => {
    loadingLogs.innerHTML = '';
    const logs = [
      "Establishing connection to matrimonial database...",
      "Analyzing educational lineage & verifying degree registry...",
      "Auditing annual income brackets & gross revenue credentials...",
      "Cross-referencing demographic features (height, complexion)...",
      "Calculating assets & family background metrics...",
      "Compiling profile rating matrices..."
    ];
    
    let index = 0;
    const addLog = () => {
      if (index < logs.length) {
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.textContent = `[info] ${logs[index]}`;
        loadingLogs.appendChild(div);
        loadingLogs.scrollTop = loadingLogs.scrollHeight;
        index++;
        setTimeout(addLog, 400 + Math.random() * 150);
      } else {
        setTimeout(callback, 400);
      }
    };
    
    addLog();
  };

  // --- Profile Valuation Algorithm ---
  
  const computeAndRenderValuation = () => {
    const edu = document.getElementById('groom-education').value;
    const job = document.getElementById('groom-job').value;
    const income = parseInt(incomeInput.value) || 0;
    const height = parseFloat(heightInput.value);
    const skinTone = document.querySelector('input[name="groom-tone"]:checked').value;
    const age = parseInt(ageInput.value);
    
    const selectedPerks = Array.from(document.querySelectorAll('input[name="groom-perks"]:checked'))
                               .map(cb => cb.value);

    let baseValue = 0;
    const breakdown = [];
    const kindAssets = [];

    // Dynamically adjust headers by gender
    if (userGender === 'female') {
      receiptTypeTitle.textContent = "BRIDE PROFILE VALUE AUDIT";
      receiptAmountLabel.textContent = "ESTIMATED BRIDE PROFILE WORTH";
    } else {
      receiptTypeTitle.textContent = "GROOM PROFILE VALUE AUDIT";
      receiptAmountLabel.textContent = "ESTIMATED GROOM PROFILE WORTH";
    }

    // 1. Education
    switch (edu) {
      case 'iit-iim':
        baseValue += 15000000;
        breakdown.push({ label: "IIT/IIM Premium Brand Tag", val: 15000000 });
        break;
      case 'tier1':
        baseValue += 8000000;
        breakdown.push({ label: "Tier-1 University Brand Tag", val: 8000000 });
        break;
      case 'tier2':
        baseValue += 4000000;
        breakdown.push({ label: "Tier-2/3 University Brand Tag", val: 4000000 });
        break;
      case 'degree-holder':
        baseValue += 2000000;
        breakdown.push({ label: "Graduate Degree Benchmark", val: 2000000 });
        break;
      case 'whatsapp':
        baseValue -= 3000000;
        breakdown.push({ label: "Unaccredited Institution Discount", val: -3000000 });
        break;
    }

    // 2. Job Sector
    switch (job) {
      case 'ias-ips':
        baseValue += 12000000;
        breakdown.push({ label: "Civil Services Premium (Pension Secured)", val: 12000000 });
        kindAssets.push("🚗 Sedan Vehicle Option", "🏞️ Residential Land Allocation");
        break;
      case 'mnc-faang':
        baseValue += 5000000;
        breakdown.push({ label: "MNC / Corporate Tech Surcharge", val: 5000000 });
        kindAssets.push("💻 High-End Workstation Laptop", "📦 Vested Share Options");
        break;
      case 'startup-founder':
        baseValue += 1000000;
        breakdown.push({ label: "Startup Equity Speculative Premium", val: 1000000 });
        kindAssets.push("📉 Sweat Equity Options", "☕ Premium Coffee Access");
        break;
      case 'family-biz':
        baseValue += 3000000;
        breakdown.push({ label: "Family Enterprise Inheritance Allowance", val: 3000000 });
        kindAssets.push("🏢 Executive Suite Access");
        break;
      case 'influencer':
        baseValue -= 1000000;
        breakdown.push({ label: "Social Media Platform Discount", val: -1000000 });
        kindAssets.push("🤳 Creator Lighting Kit", "🥤 Premium Supplements");
        break;
      case 'unemployed':
        baseValue -= 2000000;
        breakdown.push({ label: "Unemployed Capital Depreciation", val: -2000000 });
        break;
    }

    // 3. Salary Multiplier
    if (income > 0) {
      const salaryPremium = Math.round(income * 1.5);
      baseValue += salaryPremium;
      breakdown.push({ label: "Annual Cashflow Multiplier (1.5x)", val: salaryPremium });
    }

    // 4. Height
    if (height >= 6.0) {
      baseValue += 2500000;
      breakdown.push({ label: "Height Surcharge (>= 6ft standard)", val: 2500000 });
    } else if (height < 5.4) {
      baseValue -= 1000000;
      breakdown.push({ label: "Below Height Benchmark Discount", val: -1000000 });
    }

    // 5. Skin Tone Complexion
    switch (skinTone) {
      case 'glow':
        baseValue += 1500000;
        breakdown.push({ label: "Very Fair Complexion Index", val: 1500000 });
        break;
      case 'fair':
        baseValue += 3000000; // Fair/Wheatish standard
        breakdown.push({ label: "Standard Fair/Wheatish Complexion Index", val: 3000000 });
        break;
      case 'dusky':
        baseValue -= 1000000; // Traditional bias discount
        breakdown.push({ label: "Dusky Complexion Index (Societal bias filter)", val: -1000000 });
        break;
      case 'dark':
        baseValue -= 2000000; // Deep skin traditional bias discount
        breakdown.push({ label: "Dark Complexion Index (Societal bias filter)", val: -2000000 });
        break;
    }

    // 6. Age
    if (age >= 21 && age <= 25) {
      baseValue += 1500000;
      breakdown.push({ label: "Optimal Age Bracket Surcharge", val: 1500000 });
    } else if (age >= 31 && age <= 35) {
      baseValue -= 1000000;
      breakdown.push({ label: "Age Coefficient Depreciation", val: -1000000 });
    } else if (age > 35) {
      baseValue -= 3000000;
      breakdown.push({ label: "Vintage Profile Depreciation", val: -3000000 });
    }

    // 7. Perks
    selectedPerks.forEach(perk => {
      switch (perk) {
        case 'nri-sibling':
          baseValue += 2000000;
          breakdown.push({ label: "NRI Sibling Link Buffer", val: 2000000 });
          kindAssets.push("✈️ Foreign Travel Buffer");
          break;
        case 'metro-flat':
          baseValue += 4000000;
          breakdown.push({ label: "Metro Property Premium", val: 4000000 });
          kindAssets.push("🏢 Metro Apartment Co-ownership");
          break;
        case 'politician-father':
          baseValue += 5000000;
          breakdown.push({ label: "Family Influence Buffer", val: 5000000 });
          kindAssets.push("🏛️ Corporate/Government Liaison Perks");
          break;
        case 'chef-skill':
          baseValue += 1000000;
          breakdown.push({ label: "Household Culinary Skill Bonus", val: 1000000 });
          kindAssets.push("🍳 Professional Cookware Set");
          break;
        case 'dog-owner':
          baseValue += 500000;
          breakdown.push({ label: "Pet Ownership Bonus", val: 500000 });
          break;
        case 'no-gym-selfie':
          baseValue += 1500000;
          breakdown.push({ label: "Emotional Maturity Credit", val: 1500000 });
          break;
      }
    });

    estimatedValuation = Math.max(0, baseValue);

    // Render receipt details
    if (userGender === 'male' && income < 1000000) {
      receiptTotalValue.textContent = "Ah income ki dowry endhuku ra";
      receiptTotalValue.style.fontSize = "1.6rem";
      receiptAmountText.textContent = "";
      
      receiptBreakdown.innerHTML = '<li style="justify-content: center; color: var(--color-danger); font-weight: 600;">Valuation nullified due to low income index.</li>';
      receiptAssetsKind.innerHTML = '<p style="font-size: 0.85rem; color: #6b7280; text-align: center;">None. Dowry not applicable.</p>';
    } else {
      receiptTotalValue.textContent = formatCurrency(estimatedValuation);
      receiptTotalValue.style.fontSize = "2.5rem";
      receiptAmountText.textContent = numberToWordsIndian(estimatedValuation) + " Only";

      // Populate Breakdown list
      receiptBreakdown.innerHTML = '';
      breakdown.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${item.label}</span>
          <span style="color: ${item.val >= 0 ? '#10b981' : '#ef4444'}">
            ${item.val >= 0 ? '+' : ''}${formatCurrency(item.val)}
          </span>
        `;
        receiptBreakdown.appendChild(li);
      });

      // Populate Kind Assets
      receiptAssetsKind.innerHTML = '';
      if (kindAssets.length > 0) {
        kindAssets.forEach(asset => {
          const span = document.createElement('span');
          span.className = 'asset-tag';
          span.textContent = asset;
          receiptAssetsKind.appendChild(span);
        });
      } else {
        const p = document.createElement('p');
        p.style.fontSize = '0.85rem';
        p.style.color = '#6b7280';
        p.textContent = "None required. Standard cash index applies.";
        receiptAssetsKind.appendChild(p);
      }
    }

    // Custom demographic status banner checks
    const statusBanner = document.getElementById('receipt-status-banner');
    if (statusBanner) {
      if (userGender === 'female' && age < 25) {
        statusBanner.className = 'status-banner-active status-banner-info';
        statusBanner.innerHTML = '<strong>pilla inka chinna pille</strong>';
      } else if (userGender === 'male' && income > 1000000) {
        statusBanner.className = 'status-banner-active status-banner-warning';
        statusBanner.innerHTML = '<strong>Thappu ra thammudu</strong><span class="status-banner-sub">antha income undhi kadha</span>';
      } else {
        statusBanner.className = 'hidden';
        statusBanner.innerHTML = '';
      }
    }

    // Set up share links immediately
    setupShareLinks(userName);
  };

  // --- Utility Formatting Functions ---
  
  const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  const numberToWordsIndian = (num) => {
    if (num === 0) return 'Zero Rupees';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    function convertLessThanOneThousand(n) {
      if (n === 0) return '';
      let temp = '';
      if (n >= 100) {
        temp += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n >= 20) {
        temp += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      }
      if (n > 0) {
        temp += ones[n] + ' ';
      }
      return temp.trim();
    }

    let words = '';
    let crore = Math.floor(num / 10000000);
    num %= 10000000;
    let lakh = Math.floor(num / 100000);
    num %= 100000;
    let thousand = Math.floor(num / 1000);
    num %= 1000;
    
    if (crore > 0) {
      words += convertLessThanOneThousand(crore) + ' Crore ';
    }
    if (lakh > 0) {
      words += convertLessThanOneThousand(lakh) + ' Lakh ';
    }
    if (thousand > 0) {
      words += convertLessThanOneThousand(thousand) + ' Thousand ';
    }
    if (num > 0) {
      words += convertLessThanOneThousand(num);
    }
    
    return words.trim() + ' Rupees';
  };

  // --- Result Tab Navigation ---
  
  window.switchResultTab = (tabName) => {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.getElementById(`tab-btn-${tabName}`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
  };

  // --- Dynamic Social Share Builders ---
  
  const setupShareLinks = (name) => {
    const siteUrl = window.location.href.split('?')[0];
    const income = parseInt(incomeInput.value) || 0;
    
    let message = '';
    if (userGender === 'male' && income < 1000000) {
      message = `My MatriVal Matrimonial Profile rating: Ah income ki dowry endhuku ra! ⚖️ Audit your profile rating here: ${siteUrl}`;
    } else {
      const textValuation = formatCurrency(estimatedValuation);
      message = `My MatriVal Matrimonial Profile rating is ${textValuation}! 💰 Audit your profile rating here: ${siteUrl}`;
    }
    
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    
    shareWhatsappBtn.href = whatsappUrl;
    shareTwitterBtn.href = twitterUrl;
  };
});
