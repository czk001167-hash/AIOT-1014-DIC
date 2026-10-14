/**
 * 50 Startups Feature Selection Interactive Dashboard
 * Supporting 5 Feature Selection Algorithms across k = 1 to 5 features
 */

// 1. DATA REPOSITORY (Evaluations for RS=0 and RS=42)
const APP_DATA = {
  // Random State 0 (Exact match with user screenshot)
  "0": {
    meta: {
      best_k: 2,
      best_rmse: "8,198.80",
      best_r2: "0.9474",
      best_features: "R&D Spend + Marketing Spend",
      k1_rmse: "8,274.87",
      k1_r2: "0.9465",
      k5_rmse: "9,137.99",
      k5_r2: "0.9347"
    },
    models: {
      "1_feature": {
        intercept: 48416.30,
        coef: { "R&D Spend": 0.8516 }
      },
      "2_feature": {
        intercept: 46346.34,
        coef: { "R&D Spend": 0.7886, "Marketing Spend": 0.0326 }
      },
      "3_feature": {
        intercept: 46100.29,
        coef: { "R&D Spend": 0.7859, "Marketing Spend": 0.0333, "State_New York": 864.00 }
      },
      "5_feature": {
        intercept: 42554.17,
        coef: {
          "R&D Spend": 0.7735,
          "Administration": 0.0329,
          "Marketing Spend": 0.0366,
          "State_Florida": -959.28,
          "State_New York": 699.37
        }
      }
    },
    algorithms: {
      "SelectKBest": {
        name: "SelectKBest (Filter)",
        color: "#6366f1",
        data: [
          { k: 1, features: ["R&D Spend"], rmse: 8274.87, r2: 0.9465, status: "good", desc: "基線單變數" },
          { k: 2, features: ["R&D Spend", "Marketing Spend"], rmse: 8198.80, r2: 0.9474, status: "gold", desc: "🏆 全域最佳" },
          { k: 3, features: ["R&D Spend", "Marketing Spend", "Administration"], rmse: 8803.78, r2: 0.9394, status: "warn", desc: "行政支出引入微噪" },
          { k: 4, features: ["R&D Spend", "Marketing Spend", "Administration", "State_New York"], rmse: 8997.20, r2: 0.9367, status: "warn", desc: "多增紐約虛擬變數" },
          { k: 5, features: ["R&D Spend", "Marketing Spend", "Administration", "State_New York", "State_Florida"], rmse: 9137.99, r2: 0.9347, status: "poor", desc: "全特徵過擬合" }
        ]
      },
      "RFE": {
        name: "RFE (Wrapper)",
        color: "#10b981",
        data: [
          { k: 1, features: ["R&D Spend"], rmse: 8274.87, r2: 0.9465, status: "good", desc: "最強標準化權重" },
          { k: 2, features: ["R&D Spend", "Marketing Spend"], rmse: 8198.80, r2: 0.9474, status: "gold", desc: "🏆 全域最佳" },
          { k: 3, features: ["R&D Spend", "Administration", "Marketing Spend"], rmse: 8803.78, r2: 0.9394, status: "warn", desc: "數值特徵全選" },
          { k: 4, features: ["R&D Spend", "Administration", "Marketing Spend", "State_Florida"], rmse: 9068.54, r2: 0.9357, status: "warn", desc: "保留佛州特徵" },
          { k: 5, features: ["R&D Spend", "Administration", "Marketing Spend", "State_Florida", "State_New York"], rmse: 9137.99, r2: 0.9347, status: "poor", desc: "全特徵" }
        ]
      },
      "Sequential_Selection": {
        name: "SFS (Forward Wrapper)",
        color: "#f59e0b",
        data: [
          { k: 1, features: ["R&D Spend"], rmse: 8274.87, r2: 0.9465, status: "good", desc: "前向 CV 最高" },
          { k: 2, features: ["R&D Spend", "Marketing Spend"], rmse: 8198.80, r2: 0.9474, status: "gold", desc: "🏆 全域最佳" },
          { k: 3, features: ["R&D Spend", "Administration", "Marketing Spend"], rmse: 8803.78, r2: 0.9394, status: "warn", desc: "前向貪婪加入" },
          { k: 4, features: ["R&D Spend", "Administration", "Marketing Spend", "State_Florida"], rmse: 9068.54, r2: 0.9357, status: "warn", desc: "CV 增益放緩" },
          { k: 5, features: ["R&D Spend", "Administration", "Marketing Spend", "State_Florida", "State_New York"], rmse: 9137.99, r2: 0.9347, status: "poor", desc: "全特徵" }
        ]
      },
      "Lasso": {
        name: "Lasso (Embedded)",
        color: "#06b6d4",
        data: [
          { k: 1, features: ["R&D Spend"], rmse: 8274.87, r2: 0.9465, status: "good", desc: "L1 正則最大保留項" },
          { k: 2, features: ["R&D Spend", "Marketing Spend"], rmse: 8198.80, r2: 0.9474, status: "gold", desc: "🏆 全域最佳" },
          { k: 3, features: ["R&D Spend", "Marketing Spend", "Administration"], rmse: 8803.78, r2: 0.9394, status: "warn", desc: "進入係數小幅劣化" },
          { k: 4, features: ["R&D Spend", "Marketing Spend", "Administration", "State_Florida"], rmse: 9068.54, r2: 0.9357, status: "warn", desc: "稀疏性鬆綁" },
          { k: 5, features: ["R&D Spend", "Marketing Spend", "Administration", "State_Florida", "State_New York"], rmse: 9137.99, r2: 0.9347, status: "poor", desc: "無懲罰 OLS 極限" }
        ]
      },
      "VIF": {
        name: "VIF (Collinearity Diagnostic)",
        color: "#f43f5e",
        data: [
          { k: 1, features: ["Marketing Spend"], rmse: 25529.05, r2: 0.4904, status: "poor", desc: "失去 R&D, 預測力潰縮" },
          { k: 2, features: ["Marketing Spend", "State_New York"], rmse: 28603.15, r2: 0.3603, status: "poor", desc: "缺乏核心解釋力" },
          { k: 3, features: ["Administration", "Marketing Spend", "State_New York"], rmse: 31294.43, r2: 0.2342, status: "poor", desc: "誤差持續放大" },
          { k: 4, features: ["Administration", "Marketing Spend", "State_Florida", "State_New York"], rmse: 32175.96, r2: 0.1905, status: "poor", desc: "僅能解釋 19%" },
          { k: 5, features: ["R&D Spend", "Administration", "Marketing Spend", "State_Florida", "State_New York"], rmse: 9137.99, r2: 0.9347, status: "warn", desc: "終納入 R&D Spend" }
        ]
      }
    }
  },

  // Random State 42 (Setting in main.py)
  "42": {
    meta: {
      best_k: 1,
      best_rmse: "7,714.33",
      best_r2: "0.9265",
      best_features: "R&D Spend",
      k1_rmse: "7,714.33",
      k1_r2: "0.9265",
      k5_rmse: "9,055.96",
      k5_r2: "0.8987"
    },
    models: {
      "1_feature": {
        intercept: 49336.67,
        coef: { "R&D Spend": 0.8536 }
      },
      "2_feature": {
        intercept: 45542.39,
        coef: { "R&D Spend": 0.7834, "Marketing Spend": 0.0392 }
      },
      "3_feature": {
        intercept: 45671.89,
        coef: { "R&D Spend": 0.7841, "Marketing Spend": 0.0391, "State_New York": -510.46 }
      },
      "5_feature": {
        intercept: 54028.04,
        coef: {
          "R&D Spend": 0.8056,
          "Administration": -0.0688,
          "Marketing Spend": 0.0299,
          "State_Florida": 938.79,
          "State_New York": 6.99
        }
      }
    },
    algorithms: {
      "SelectKBest": {
        name: "SelectKBest (Filter)",
        color: "#6366f1",
        data: [
          { k: 1, features: ["R&D Spend"], rmse: 7714.33, r2: 0.9265, status: "gold", desc: "單特徵最佳" },
          { k: 2, features: ["R&D Spend", "Marketing Spend"], rmse: 8206.33, r2: 0.9168, status: "good", desc: "次優雙特徵" },
          { k: 3, features: ["R&D Spend", "Marketing Spend", "State_New York"], rmse: 8242.78, r2: 0.9161, status: "good", desc: "三特徵平穩" },
          { k: 4, features: ["R&D Spend", "Marketing Spend", "State_New York", "State_Florida"], rmse: 8254.69, r2: 0.9159, status: "good", desc: "加入佛州" },
          { k: 5, features: ["R&D Spend", "Marketing Spend", "State_New York", "State_Florida", "Administration"], rmse: 9055.96, r2: 0.8987, status: "poor", desc: "全特徵退化" }
        ]
      },
      "RFE": {
        name: "RFE (Wrapper)",
        color: "#10b981",
        data: [
          { k: 1, features: ["R&D Spend"], rmse: 7714.33, r2: 0.9265, status: "gold", desc: "單特徵最佳" },
          { k: 2, features: ["R&D Spend", "Marketing Spend"], rmse: 8206.33, r2: 0.9168, status: "good", desc: "次優雙特徵" },
          { k: 3, features: ["R&D Spend", "Administration", "Marketing Spend"], rmse: 8995.91, r2: 0.9001, status: "warn", desc: "行政支出加入" },
          { k: 4, features: ["R&D Spend", "Administration", "Marketing Spend", "State_Florida"], rmse: 9055.96, r2: 0.8987, status: "warn", desc: "誤差擴大" },
          { k: 5, features: ["R&D Spend", "Administration", "Marketing Spend", "State_Florida", "State_New York"], rmse: 9055.96, r2: 0.8987, status: "poor", desc: "全模型" }
        ]
      },
      "Sequential_Selection": {
        name: "SFS (Forward Wrapper)",
        color: "#f59e0b",
        data: [
          { k: 1, features: ["R&D Spend"], rmse: 7714.33, r2: 0.9265, status: "gold", desc: "CV 最佳單項" },
          { k: 2, features: ["R&D Spend", "Marketing Spend"], rmse: 8206.33, r2: 0.9168, status: "good", desc: "雙特徵" },
          { k: 3, features: ["R&D Spend", "Administration", "Marketing Spend"], rmse: 8995.91, r2: 0.9001, status: "warn", desc: "數值全選" },
          { k: 4, features: ["R&D Spend", "Administration", "Marketing Spend", "State_New York"], rmse: 9015.11, r2: 0.8996, status: "warn", desc: "加入紐約" },
          { k: 5, features: ["R&D Spend", "Administration", "Marketing Spend", "State_Florida", "State_New York"], rmse: 9055.96, r2: 0.8987, status: "poor", desc: "全特徵" }
        ]
      },
      "Lasso": {
        name: "Lasso (Embedded)",
        color: "#06b6d4",
        data: [
          { k: 1, features: ["R&D Spend"], rmse: 7714.33, r2: 0.9265, status: "gold", desc: "L1 首選" },
          { k: 2, features: ["R&D Spend", "Marketing Spend"], rmse: 8206.33, r2: 0.9168, status: "good", desc: "雙項" },
          { k: 3, features: ["R&D Spend", "Marketing Spend", "Administration"], rmse: 8995.91, r2: 0.9001, status: "warn", desc: "弱正則" },
          { k: 4, features: ["R&D Spend", "Marketing Spend", "Administration", "State_Florida"], rmse: 9055.96, r2: 0.8987, status: "warn", desc: "多變數" },
          { k: 5, features: ["R&D Spend", "Marketing Spend", "Administration", "State_Florida", "State_New York"], rmse: 9055.96, r2: 0.8987, status: "poor", desc: "全特徵" }
        ]
      },
      "VIF": {
        name: "VIF (Collinearity Diagnostic)",
        color: "#f43f5e",
        data: [
          { k: 1, features: ["Administration"], rmse: 31056.94, r2: -0.1911, status: "poor", desc: "極低共線性但無預測力" },
          { k: 2, features: ["Administration", "State_Florida"], rmse: 30236.10, r2: -0.1290, status: "poor", desc: "負向判定係數" },
          { k: 3, features: ["R&D Spend", "Administration", "State_Florida"], rmse: 9284.31, r2: 0.8936, status: "warn", desc: "納入 R&D 顯著修復" },
          { k: 4, features: ["R&D Spend", "Administration", "State_Florida", "State_New York"], rmse: 9316.54, r2: 0.8928, status: "warn", desc: "欠缺 Marketing" },
          { k: 5, features: ["R&D Spend", "Administration", "Marketing Spend", "State_Florida", "State_New York"], rmse: 9055.96, r2: 0.8987, status: "warn", desc: "全特徵" }
        ]
      }
    }
  }
};

// 2. STATE MANAGEMENT
let currentRandomState = "0";
let activeAlgoFilter = "all";
let rmseChartInstance = null;
let r2ChartInstance = null;

// 3. INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initRandomStateToggle();
  initAlgoFilters();
  initCharts();
  renderTable();
  initPredictor();
  initTableSearch();
  initExport();
});

// Tab Navigation
function initTabs() {
  const tabs = document.querySelectorAll("#main-nav-tabs .tab-btn");
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      
      const targetId = btn.dataset.tab;
      document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));
      const activeContent = document.getElementById(targetId);
      if (activeContent) {
        activeContent.classList.add("active");
        if (targetId === "tab-curves") {
          setTimeout(() => {
            if (rmseChartInstance) rmseChartInstance.resize();
            if (r2ChartInstance) r2ChartInstance.resize();
          }, 50);
        }
      }
    });
  });
}

// Random State Toggle
function initRandomStateToggle() {
  const btnRs0 = document.getElementById("btn-rs-0");
  const btnRs42 = document.getElementById("btn-rs-42");

  btnRs0.addEventListener("click", () => switchRandomState("0"));
  btnRs42.addEventListener("click", () => switchRandomState("42"));
}

function switchRandomState(rs) {
  if (currentRandomState === rs) return;
  currentRandomState = rs;

  document.getElementById("btn-rs-0").classList.toggle("active", rs === "0");
  document.getElementById("btn-rs-42").classList.toggle("active", rs === "42");

  updateKPICards();
  updateCharts();
  renderTable();
  updatePredictorDisplay();
}

function updateKPICards() {
  const meta = APP_DATA[currentRandomState].meta;
  document.getElementById("kpi-best-rmse").textContent = meta.best_rmse;
  document.getElementById("kpi-best-r2").textContent = meta.best_r2;
  document.getElementById("kpi-best-features").textContent = meta.best_features;

  document.getElementById("kpi-k1-rmse").textContent = meta.k1_rmse;
  document.getElementById("kpi-k1-r2").textContent = meta.k1_r2;

  document.getElementById("kpi-k5-rmse").textContent = meta.k5_rmse;
  document.getElementById("kpi-k5-r2").textContent = meta.k5_r2;
}

// Algo Filter Pills
function initAlgoFilters() {
  const pills = document.querySelectorAll("#algo-filter-pills .pill-btn");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeAlgoFilter = pill.dataset.algo;
      updateCharts();
      renderTable();
    });
  });
}

// 4. CHART.JS INITIALIZATION & UPDATES
function initCharts() {
  const ctxRmse = document.getElementById("rmseChart").getContext("2d");
  const ctxR2 = document.getElementById("r2Chart").getContext("2d");

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "rgba(11, 15, 25, 0.95)",
        titleFont: { family: "Outfit", size: 13, weight: "bold" },
        bodyFont: { family: "Plus Jakarta Sans", size: 12 },
        borderColor: "rgba(255, 255, 255, 0.15)",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: (ctx) => {
            const algoKey = ctx.dataset.algoKey;
            const ptIdx = ctx.dataIndex;
            const item = APP_DATA[currentRandomState].algorithms[algoKey].data[ptIdx];
            return `${ctx.dataset.label}: ${ctx.raw} (${item.features.join(", ")})`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "特徵數量 (Number of Features)",
          color: "#94a3b8",
          font: { family: "Outfit", size: 12, weight: 600 }
        },
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "#94a3b8" }
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "#94a3b8" }
      }
    }
  };

  rmseChartInstance = new Chart(ctxRmse, {
    type: "line",
    data: { labels: [1, 2, 3, 4, 5], datasets: [] },
    options: {
      ...commonOptions,
      scales: {
        ...commonOptions.scales,
        y: {
          ...commonOptions.scales.y,
          title: {
            display: true,
            text: "RMSE (均方根誤差，越低越好)",
            color: "#94a3b8",
            font: { family: "Outfit", size: 12, weight: 600 }
          }
        }
      }
    }
  });

  r2ChartInstance = new Chart(ctxR2, {
    type: "line",
    data: { labels: [1, 2, 3, 4, 5], datasets: [] },
    options: {
      ...commonOptions,
      scales: {
        ...commonOptions.scales,
        y: {
          ...commonOptions.scales.y,
          title: {
            display: true,
            text: "R-squared (判定係數，越高越好)",
            color: "#94a3b8",
            font: { family: "Outfit", size: 12, weight: 600 }
          }
        }
      }
    }
  });

  updateCharts();
}

function updateCharts() {
  const currentAlgos = APP_DATA[currentRandomState].algorithms;
  const datasetsRmse = [];
  const datasetsR2 = [];

  const keysToInclude = (activeAlgoFilter === "all") 
    ? Object.keys(currentAlgos) 
    : [activeAlgoFilter];

  keysToInclude.forEach(key => {
    const algo = currentAlgos[key];
    if (!algo) return;

    const isSingle = (keysToInclude.length === 1);
    const lineColor = isSingle ? "#1f77b4" : algo.color; // Match user screenshot color when single
    
    datasetsRmse.push({
      label: algo.name,
      algoKey: key,
      data: algo.data.map(d => d.rmse),
      borderColor: lineColor,
      backgroundColor: lineColor,
      borderWidth: 2.2,
      pointRadius: 5,
      pointHoverRadius: 8,
      tension: 0.15
    });

    datasetsR2.push({
      label: algo.name,
      algoKey: key,
      data: algo.data.map(d => d.r2),
      borderColor: lineColor,
      backgroundColor: lineColor,
      borderWidth: 2.2,
      pointRadius: 5,
      pointHoverRadius: 8,
      tension: 0.15
    });
  });

  rmseChartInstance.data.datasets = datasetsRmse;
  r2ChartInstance.data.datasets = datasetsR2;

  // Custom styling when single algo is selected to match user's screenshot
  if (keysToInclude.length === 1) {
    document.getElementById("rmse-chart-title").textContent = `${currentAlgos[keysToInclude[0]].name}: RMSE by Number of Features`;
    document.getElementById("r2-chart-title").textContent = `${currentAlgos[keysToInclude[0]].name}: R-squared by Number of Features`;
  } else {
    document.getElementById("rmse-chart-title").textContent = "5大演算法全體對比: RMSE by Number of Features";
    document.getElementById("r2-chart-title").textContent = "5大演算法全體對比: R-squared by Number of Features";
  }

  rmseChartInstance.update();
  r2ChartInstance.update();
}

// 5. DATA TABLE POPULATION
function renderTable() {
  const tbody = document.getElementById("table-body-content");
  tbody.innerHTML = "";

  const algos = APP_DATA[currentRandomState].algorithms;
  const keysToDisplay = (activeAlgoFilter === "all") 
    ? Object.keys(algos) 
    : [activeAlgoFilter];

  const searchQuery = document.getElementById("table-search-input").value.trim().toLowerCase();

  keysToDisplay.forEach(key => {
    const algo = algos[key];
    if (!algo) return;

    algo.data.forEach(item => {
      // Search filter check
      const featureStr = item.features.join(" ").toLowerCase();
      const algoStr = algo.name.toLowerCase();
      if (searchQuery && !featureStr.includes(searchQuery) && !algoStr.includes(searchQuery)) {
        return;
      }

      const tr = document.createElement("tr");
      if (item.status === "gold") tr.classList.add("optimal-row");

      // Badge status classes
      let badgeHtml = "";
      if (item.status === "gold") {
        badgeHtml = `<span class="status-badge gold">🏆 最佳模型</span>`;
      } else if (item.status === "good") {
        badgeHtml = `<span class="status-badge good">優良基線</span>`;
      } else if (item.status === "warn") {
        badgeHtml = `<span class="status-badge warn">雜訊微增</span>`;
      } else {
        badgeHtml = `<span class="status-badge poor">劣化/過擬合</span>`;
      }

      // Feature pills
      const featurePillsHtml = item.features.map(f => {
        let pillClass = "feature-pill";
        if (f.includes("Marketing")) pillClass += " mkt";
        else if (f.includes("Administration")) pillClass += " admin";
        else if (f.includes("State")) pillClass += " state";
        return `<span class="${pillClass}">${f}</span>`;
      }).join("");

      tr.innerHTML = `
        <td><strong style="color: ${algo.color};">${algo.name}</strong></td>
        <td style="text-align: center;"><span style="font-family: var(--font-mono); font-weight: 700;">${item.k}</span></td>
        <td>
          <div class="feature-pill-list">
            ${featurePillsHtml}
          </div>
        </td>
        <td style="text-align: right; font-family: var(--font-mono); font-weight: 600;">$${item.rmse.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="text-align: right; font-family: var(--font-mono); font-weight: 600; color: ${item.r2 > 0.9 ? '#34d399' : '#f87171'};">${item.r2.toFixed(4)}</td>
        <td style="text-align: center;">${badgeHtml}</td>
      `;

      tbody.appendChild(tr);
    });
  });
}

function initTableSearch() {
  const searchInput = document.getElementById("table-search-input");
  searchInput.addEventListener("input", () => {
    renderTable();
  });
}

// 6. INTERACTIVE PROFIT PREDICTOR
function initPredictor() {
  const sliderRd = document.getElementById("slider-rd");
  const numRd = document.getElementById("num-rd");
  const sliderMkt = document.getElementById("slider-mkt");
  const numMkt = document.getElementById("num-mkt");
  const sliderAdmin = document.getElementById("slider-admin");
  const numAdmin = document.getElementById("num-admin");
  const selectState = document.getElementById("select-state");
  const modelSelect = document.getElementById("predictor-model-select");
  const btnReset = document.getElementById("btn-reset-inputs");

  // Sync inputs
  syncInputs(sliderRd, numRd, document.getElementById("val-rd-badge"));
  syncInputs(sliderMkt, numMkt, document.getElementById("val-mkt-badge"));
  syncInputs(sliderAdmin, numAdmin, document.getElementById("val-admin-badge"));

  selectState.addEventListener("change", updatePredictorDisplay);
  modelSelect.addEventListener("change", () => {
    const optText = modelSelect.options[modelSelect.selectedIndex].text;
    document.getElementById("selected-model-desc").textContent = optText.split(" ")[1] || "自訂模型";
    updatePredictorDisplay();
  });

  btnReset.addEventListener("click", () => {
    sliderRd.value = 100000; numRd.value = 100000;
    sliderMkt.value = 200000; numMkt.value = 200000;
    sliderAdmin.value = 120000; numAdmin.value = 120000;
    selectState.value = "California";
    modelSelect.value = "2_feature";

    document.getElementById("val-rd-badge").textContent = "$100,000";
    document.getElementById("val-mkt-badge").textContent = "$200,000";
    document.getElementById("val-admin-badge").textContent = "$120,000";
    updatePredictorDisplay();
  });

  updatePredictorDisplay();
}

function syncInputs(slider, num, badge) {
  slider.addEventListener("input", () => {
    num.value = slider.value;
    badge.textContent = `$${Number(slider.value).toLocaleString()}`;
    updatePredictorDisplay();
  });

  num.addEventListener("input", () => {
    slider.value = num.value;
    badge.textContent = `$${Number(num.value).toLocaleString()}`;
    updatePredictorDisplay();
  });
}

function updatePredictorDisplay() {
  const modelType = document.getElementById("predictor-model-select").value;
  const rd = Number(document.getElementById("num-rd").value) || 0;
  const mkt = Number(document.getElementById("num-mkt").value) || 0;
  const admin = Number(document.getElementById("num-admin").value) || 0;
  const state = document.getElementById("select-state").value;

  const modelInfo = APP_DATA[currentRandomState].models[modelType];
  if (!modelInfo) return;

  const intercept = modelInfo.intercept;
  let predictedProfit = intercept;
  const contributions = [
    { name: "基準截距 (Base Intercept)", amount: intercept }
  ];

  if (modelInfo.coef["R&D Spend"]) {
    const val = rd * modelInfo.coef["R&D Spend"];
    predictedProfit += val;
    contributions.push({ name: `R&D Spend (×${modelInfo.coef["R&D Spend"].toFixed(4)})`, amount: val });
  }

  if (modelInfo.coef["Marketing Spend"]) {
    const val = mkt * modelInfo.coef["Marketing Spend"];
    predictedProfit += val;
    contributions.push({ name: `Marketing Spend (×${modelInfo.coef["Marketing Spend"].toFixed(4)})`, amount: val });
  }

  if (modelInfo.coef["Administration"]) {
    const val = admin * modelInfo.coef["Administration"];
    predictedProfit += val;
    contributions.push({ name: `Administration (×${modelInfo.coef["Administration"].toFixed(4)})`, amount: val });
  }

  if (state === "New York" && modelInfo.coef["State_New York"]) {
    const val = modelInfo.coef["State_New York"];
    predictedProfit += val;
    contributions.push({ name: `設立紐約州 (State_New York 虛擬增益)`, amount: val });
  }

  if (state === "Florida" && modelInfo.coef["State_Florida"]) {
    const val = modelInfo.coef["State_Florida"];
    predictedProfit += val;
    contributions.push({ name: `設立佛州 (State_Florida 虛擬影響)`, amount: val });
  }

  // Display result with smooth animation
  const resultDisplay = document.getElementById("prediction-result-display");
  resultDisplay.textContent = Math.round(predictedProfit).toLocaleString();

  // Formula tag text
  const formulaParts = [`${intercept.toFixed(2)}`];
  Object.entries(modelInfo.coef).forEach(([feat, slope]) => {
    formulaParts.push(`${slope >= 0 ? "+" : "-"} ${Math.abs(slope).toFixed(4)} × ${feat.replace("State_", "")}`);
  });
  document.getElementById("prediction-equation-tag").textContent = `回歸方程式: ${formulaParts.join(" ")}`;

  // Render contributions
  const breakdownList = document.getElementById("contribution-breakdown-list");
  breakdownList.innerHTML = contributions.map(c => `
    <div class="breakdown-row">
      <span class="breakdown-name">${c.name}</span>
      <span class="breakdown-val" style="color: ${c.amount >= 0 ? '#38bdf8' : '#f87171'};">
        ${c.amount >= 0 ? "+" : ""}$${Math.round(c.amount).toLocaleString()}
      </span>
    </div>
  `).join("");
}

// 7. EXPORT TO CSV
function initExport() {
  document.getElementById("btn-export-csv").addEventListener("click", () => {
    const algos = APP_DATA[currentRandomState].algorithms;
    let csv = "RandomState,Algorithm,k,SelectedFeatures,RMSE,R2\n";

    Object.entries(algos).forEach(([key, algo]) => {
      algo.data.forEach(d => {
        csv += `${currentRandomState},"${algo.name}",${d.k},"${d.features.join("; ")}",${d.rmse},${d.r2}\n`;
      });
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feature_selection_comparison_rs${currentRandomState}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });
}
