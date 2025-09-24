    // ---------- Financeiro ----------
    let items = JSON.parse(localStorage.getItem('financeItems')) || [];
    let editingIndex = null;

    const tbody = document.querySelector('#financeTable tbody');
    const modal = document.getElementById('finModal');

    function renderTable() {
      tbody.innerHTML = '';
      items.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.desc}</td>
          <td>${item.date}</td>
          <td>${item.value}</td>
          <td>
            <button class="edit-btn" onclick="editItem(${index})">Editar</button>
            <button class="delete-btn" onclick="deleteItem(${index})">Excluir</button>
          </td>
        `;
        tbody.appendChild(row);
      });
      renderChart();
    }

    function openModal() {
      modal.style.display = 'flex';
      editingIndex = null;
      document.getElementById('itemDesc').value = '';
      document.getElementById('itemDate').value = '';
      document.getElementById('itemValue').value = '';
    }

    function closeModal() { modal.style.display = 'none'; }

    function saveItem() {
      const desc = document.getElementById('itemDesc').value.trim();
      const date = document.getElementById('itemDate').value;
      const value = parseFloat(document.getElementById('itemValue').value);

      if (!desc || !date || isNaN(value)) return alert('Preencha todos os campos corretamente!');

      const item = { desc, date, value };
      if (editingIndex !== null) items[editingIndex] = item;
      else items.push(item);

      localStorage.setItem('financeItems', JSON.stringify(items));
      renderTable();
      closeModal();
    }

    function editItem(index) {
      editingIndex = index;
      const item = items[index];
      document.getElementById('itemDesc').value = item.desc;
      document.getElementById('itemDate').value = item.date;
      document.getElementById('itemValue').value = item.value;
      modal.style.display = 'flex';
    }

    function deleteItem(index) {
      if (confirm('Deseja realmente excluir este item?')) {
        items.splice(index, 1);
        localStorage.setItem('financeItems', JSON.stringify(items));
        renderTable();
      }
    }

    // ---------- Gráfico de Pizza ----------
    let chart = null;
    function renderChart() {
      const ctx = document.getElementById('financeChart').getContext('2d');
      const totalPos = items.filter(i => i.value >= 0).reduce((acc, i) => acc + i.value, 0);
      const totalNeg = items.filter(i => i.value < 0).reduce((acc, i) => acc + Math.abs(i.value), 0);

      if (chart) chart.destroy();
      chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Receitas', 'Despesas'],
          datasets: [{
            data: [totalPos, totalNeg],
            backgroundColor: ['green', 'red']
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    renderTable();

    // ---------- Calculadora ----------
    let calcValue = '';
    function toggleCalculator() {
      const calc = document.getElementById('calculator');
      calc.style.display = calc.style.display === 'flex' ? 'none' : 'flex';
    }
    function updateDisplay() { document.getElementById('calcDisplay').value = calcValue; }
    function appendCalc(value) { if (/[\+\-\*\/\.%]/.test(value) && /[\+\-\*\/\.%]$/.test(calcValue)) return; calcValue += value; updateDisplay(); }
    function clearCalc() { calcValue = ''; updateDisplay(); }
    function clearEntry() { calcValue = calcValue.slice(0, -1); updateDisplay(); }
    function toggleSign() { if (!calcValue) return; const match = calcValue.match(/(\d+\.?\d*)$/); if (match) { const num = match[0]; const start = calcValue.slice(0, -num.length); calcValue = start + (parseFloat(num) * -1); updateDisplay(); } }
    function calculate() { try { let sanitized = calcValue.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '*0.01'); let result = Function('"use strict";return (' + sanitized + ')')(); if (!Number.isInteger(result)) result = parseFloat(result.toFixed(10)); calcValue = result.toString(); updateDisplay(); } catch { calcValue = ''; document.getElementById('calcDisplay').value = 'Erro'; } }
  