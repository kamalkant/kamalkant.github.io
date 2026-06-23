document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // 1. DYNAMIC GEOLOCATION PERSONALIZATION
  // ==========================================
  const statePlaceholder = document.getElementById("state-placeholder");
  const calcState = document.getElementById("calc-state");

  const detectLocation = async () => {
    try {
      const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
      if (!response.ok) throw new Error("Geo request failed");
      const data = await response.json();
      
      if (data.region) {
        const stateName = data.region;
        // Update all elements with the class
        document.querySelectorAll(".geo-state").forEach(el => {
          el.textContent = stateName;
        });

        // Set matching state in the savings calculator if exists
        const stateMapping = {
          "California": "CA",
          "Texas": "TX",
          "Florida": "FL",
          "New York": "NY",
          "Illinois": "IL"
        };
        const stateCode = stateMapping[stateName];
        if (stateCode && calcState) {
          calcState.value = stateCode;
          updateCalculator();
        }
      }
    } catch (error) {
      console.warn("Could not determine location, using fallback:", error);
      document.querySelectorAll(".geo-state").forEach(el => {
        el.textContent = "the USA";
      });
    }
  };
  detectLocation();

  // ==========================================
  // 2. BEFORE/AFTER IMAGE SLIDER
  // ==========================================
  const slider = document.getElementById("roof-slider");
  const handle = document.getElementById("slider-handle");

  if (slider && handle) {
    let isDragging = false;

    const setSliderPos = (x) => {
      const rect = slider.getBoundingClientRect();
      const pos = ((x - rect.left) / rect.width) * 100;
      // Clamp between 0% and 100%
      const clamped = Math.max(0, Math.min(100, pos));
      slider.style.setProperty("--slider-pos", `${clamped}%`);
    };

    const onStart = (e) => {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setSliderPos(clientX);
    };

    const onMove = (e) => {
      if (!isDragging) return;
      // Prevent scrolling on touch devices while dragging
      if (e.cancelable) e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setSliderPos(clientX);
    };

    const onEnd = () => {
      isDragging = false;
    };

    // Event Listeners for Mouse
    slider.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);

    // Event Listeners for Touch
    slider.addEventListener("touchstart", onStart, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
  }

  // ==========================================
  // 3. STEP-BY-STEP ELIGIBILITY WIZARD
  // ==========================================
  let currentStep = 1;
  const totalSteps = 5; // Form steps (1-4, then 5 is loader, 6 is result)
  const wizardData = {
    zipCode: "",
    homeowner: "",
    roofType: "",
    roofAge: ""
  };

  const steps = {
    1: document.getElementById("step-1"),
    2: document.getElementById("step-2"),
    3: document.getElementById("step-3"),
    4: document.getElementById("step-4"),
    5: document.getElementById("step-5"),
    6: document.getElementById("step-6")
  };

  const progressFill = document.getElementById("progress-fill");
  const progressSteps = document.querySelectorAll(".progress-step");

  const updateProgress = () => {
    // Fill width percentage: steps 1 to 5 mapping to 0% to 100%
    const fillPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    if (progressFill) progressFill.style.width = `${Math.min(100, fillPercent)}%`;

    progressSteps.forEach(step => {
      const stepNum = parseInt(step.dataset.step);
      if (stepNum < currentStep) {
        step.className = "progress-step completed";
        step.innerHTML = '<i class="fa-solid fa-check"></i>';
      } else if (stepNum === currentStep) {
        step.className = "progress-step active";
        step.textContent = stepNum;
      } else {
        step.className = "progress-step";
        step.textContent = stepNum;
      }
    });
  };

  const showStep = (stepNumber) => {
    Object.keys(steps).forEach(key => {
      steps[key].classList.remove("active");
    });
    steps[stepNumber].classList.add("active");
    currentStep = stepNumber;
    
    // Hide progress bar on Step 6 (Result page)
    const tracker = document.querySelector(".wizard-progress");
    if (currentStep === 6) {
      if (tracker) tracker.style.display = "none";
    } else {
      if (tracker) tracker.style.display = "flex";
      updateProgress();
    }
  };

  // Step 1: Zip Code Check
  const zipInput = document.getElementById("zip-input");
  const btnZipNext = document.getElementById("btn-zip-next");

  const validateZip = (zip) => {
    return /^\d{5}$/.test(zip);
  };

  const handleZipSubmit = () => {
    const value = zipInput.value.trim();
    if (validateZip(value)) {
      wizardData.zipCode = value;
      zipInput.style.borderColor = "var(--color-border)";
      showStep(2);
    } else {
      zipInput.style.borderColor = "var(--color-secondary)";
      zipInput.focus();
      // Simple shake effect
      zipInput.style.animation = "shake 0.3s ease-in-out 2";
      setTimeout(() => { zipInput.style.animation = ""; }, 600);
    }
  };

  if (btnZipNext) {
    btnZipNext.addEventListener("click", handleZipSubmit);
  }
  if (zipInput) {
    zipInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleZipSubmit();
    });
  }

  // Handle option selection for steps 2, 3, and 4
  const setupStepOptions = (stepId, dataKey, nextStepNum) => {
    const stepEl = document.getElementById(stepId);
    if (!stepEl) return;

    const cards = stepEl.querySelectorAll(".option-card");
    cards.forEach(card => {
      card.addEventListener("click", () => {
        // Deselect siblings
        cards.forEach(c => c.classList.remove("selected"));
        
        card.classList.add("selected");
        wizardData[dataKey] = card.dataset.val;

        // Auto advance to next step after brief delay
        setTimeout(() => {
          if (nextStepNum === 5) {
            runLoaderSequence();
          } else {
            showStep(nextStepNum);
          }
        }, 300);
      });
    });
  };

  setupStepOptions("step-2", "homeowner", 3);
  setupStepOptions("step-3", "roofType", 4);
  setupStepOptions("step-4", "roofAge", 5);

  // Back Button Logic
  document.querySelectorAll(".btn-back").forEach(btn => {
    btn.addEventListener("click", () => {
      if (currentStep > 1) {
        showStep(currentStep - 1);
      }
    });
  });

  // Step 5: Simulated Qualification Scan
  const runLoaderSequence = () => {
    showStep(5);
    
    const items = {
      1: document.getElementById("analysis-1"),
      2: document.getElementById("analysis-2"),
      3: document.getElementById("analysis-3")
    };

    // Step 5-1: Validating zip code
    setTimeout(() => {
      items[1].innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Zip Code matches coverage database.</span>';
      items[1].className = "analysis-item checked";
      items[2].innerHTML = '<i class="fa-solid fa-circle-notch"></i> <span>Evaluating rebate program budget...</span>';
      items[2].className = "analysis-item";
    }, 1000);

    // Step 5-2: Rebates
    setTimeout(() => {
      items[2].innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Grants & incentives available.</span>';
      items[2].className = "analysis-item checked";
      items[3].innerHTML = '<i class="fa-solid fa-circle-notch"></i> <span>Locating local licensed inspectors...</span>';
      items[3].className = "analysis-item";
    }, 2000);

    // Step 5-3: Inspector check and finish
    setTimeout(() => {
      items[3].innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>3 Certified inspectors ready in your area.</span>';
      items[3].className = "analysis-item checked";
    }, 3000);

    // Slide to final congratulations
    setTimeout(() => {
      showStep(6);
    }, 3600);
  };

  // Final Lead Form Submission
  const leadForm = document.getElementById("lead-form");
  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = document.getElementById("full-name").value.trim();
      const email = document.getElementById("email-address").value.trim();
      const phone = document.getElementById("phone-number").value.trim();

      // Show final thank you card instead of form
      const successContainer = document.querySelector(".success-container");
      if (successContainer) {
        successContainer.innerHTML = `
          <div class="success-badge" style="background:#dcfce7; color:var(--color-success);">
            <i class="fa-solid fa-calendar-check"></i>
          </div>
          <h3>Inspection Slot Reserved!</h3>
          <p>Thank you, <strong>${name}</strong>. An advisor will contact you at <strong>${phone}</strong> within 15 minutes to confirm your physical inspection appointment.</p>
          <div style="background:var(--color-bg-light); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.25rem; font-size: 0.9rem; text-align: left; color:#475569; margin-top:1.5rem;">
            <div style="margin-bottom:0.5rem;"><i class="fa-solid fa-circle-check" style="color:var(--color-success);"></i> <strong>Zip Code:</strong> ${wizardData.zipCode}</div>
            <div style="margin-bottom:0.5rem;"><i class="fa-solid fa-circle-check" style="color:var(--color-success);"></i> <strong>Roof Type:</strong> ${wizardData.roofType.toUpperCase()}</div>
            <div style="margin-bottom:0.5rem;"><i class="fa-solid fa-circle-check" style="color:var(--color-success);"></i> <strong>Roof Age:</strong> ${wizardData.roofAge.replace('_', ' ')} Years</div>
            <div><i class="fa-solid fa-circle-check" style="color:var(--color-success);"></i> <strong>Allocated Savings ID:</strong> RR-${Math.floor(100000 + Math.random() * 900000)}</div>
          </div>
        `;
      }
    });
  }

  // ==========================================
  // 4. INTERACTIVE SAVINGS ESTIMATOR
  // ==========================================
  const calcSize = document.getElementById("calc-size");
  const calcSizeVal = document.getElementById("calc-size-val");
  const calcCondition = document.getElementById("calc-condition");
  const calcSavings = document.getElementById("calc-savings");
  const btnCalcApply = document.getElementById("btn-calc-apply");

  const updateCalculator = () => {
    if (!calcSize || !calcCondition || !calcState || !calcSavings) return;

    const size = parseInt(calcSize.value);
    const condition = calcCondition.value;
    const state = calcState.value;

    // Display current slider value
    calcSizeVal.textContent = `${size.toLocaleString()} sq. ft.`;

    // Base math
    let baseSavings = 4000;
    
    // Size addition
    baseSavings += size * 1.5;

    // Condition multiplier
    let multiplier = 1.0;
    if (condition === "critical") {
      multiplier = 1.4;
    } else if (condition === "minor") {
      multiplier = 0.6;
    }
    baseSavings *= multiplier;

    // State bonus
    const stateBonuses = {
      "CA": 2000,
      "TX": 1200,
      "FL": 2500,
      "NY": 1800,
      "IL": 1000,
      "OTHER": 500
    };
    baseSavings += (stateBonuses[state] || 0);

    // Format currency
    const formatted = `$${Math.round(baseSavings).toLocaleString()}`;
    calcSavings.textContent = formatted;
  };

  if (calcSize) calcSize.addEventListener("input", updateCalculator);
  if (calcCondition) calcCondition.addEventListener("change", updateCalculator);
  if (calcState) calcState.addEventListener("change", updateCalculator);

  // Initialize Estimator
  updateCalculator();

  // Scroll to Wizard on Estimate CTA click
  if (btnCalcApply) {
    btnCalcApply.addEventListener("click", () => {
      const wizard = document.getElementById("wizard");
      if (wizard) {
        wizard.scrollIntoView({ behavior: "smooth", block: "center" });
        // Focus zip input if we are on step 1
        if (currentStep === 1 && zipInput) {
          zipInput.focus();
        }
      }
    });
  }

  // ==========================================
  // 5. TESTIMONIALS / FAQ ACCORDIONS
  // ==========================================
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach(question => {
    question.addEventListener("click", () => {
      const item = question.parentNode;
      
      // Close all other items
      document.querySelectorAll(".faq-item").forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });

      // Toggle this item
      item.classList.toggle("active");
    });
  });

  // ==========================================
  // 6. LIVE ACTIVITY TOAST NOTIFICATIONS
  // ==========================================
  const toast = document.getElementById("activity-toast");
  const toastTitle = document.getElementById("toast-title");
  const toastDesc = document.getElementById("toast-desc");

  const users = [
    { name: "Sarah M.", location: "Dallas, TX", savings: "$9,200", details: "qualified for energy credits." },
    { name: "Robert K.", location: "Miami, FL", savings: "$11,500", details: "secured storm-damage subsidies." },
    { name: "David L.", location: "Columbus, OH", savings: "$7,800", details: "approved for $0 roof inspection." },
    { name: "Emma G.", location: "Los Angeles, CA", savings: "$13,400", details: "claimed clean-energy roofing rebates." },
    { name: "James S.", location: "Chicago, IL", savings: "$8,500", details: "matched with top-rated local contractor." },
    { name: "Linda W.", location: "Atlanta, GA", savings: "$10,200", details: "qualified for high-wind relief program." }
  ];

  let toastIndex = 0;

  const showNextToast = () => {
    if (!toast || !toastTitle || !toastDesc) return;

    const user = users[toastIndex];
    toastTitle.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--color-success); margin-right:4px;"></i> ${user.name} from ${user.location}`;
    toastDesc.innerHTML = `Saved <strong>${user.savings}</strong> &amp; ${user.details}`;
    
    // Slide up toast
    toast.classList.add("show");

    // Slide down after 4.5 seconds
    setTimeout(() => {
      toast.classList.remove("show");
    }, 4500);

    // Go to next user
    toastIndex = (toastIndex + 1) % users.length;
  };

  // Trigger first toast after 4 seconds
  setTimeout(() => {
    showNextToast();
    // Repeat every 11 seconds
    setInterval(showNextToast, 11000);
  }, 4000);

});
