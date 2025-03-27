document.addEventListener("DOMContentLoaded", function () {
    const redirectElements = document.querySelectorAll(".redirect");

    redirectElements.forEach((element) => {
        element.addEventListener("click", function () {
            const page = element.textContent.trim().toLowerCase();

            switch (page) {
                case "home":
                    window.location.href = "/";
                    break;
                case "sobre nós":
                    window.location.href = "/sobre";
                    break;
                case "admin":
                    window.location.href = "/admin";
                    break;
                default:
                    console.log("Página não encontrada.");
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = 'http://localhost:3000';
    let residents = [];
    let vehicles = [];
    let residentsChart = null;
    let currentResidentId = null;
    let currentVehicleId = null;

    if (!localStorage.getItem('loggedIn')) {
        window.location.href = '/admin';
    }

    // Elementos do DOM
    const residentsTable = document.getElementById('residentsTable').getElementsByTagName('tbody')[0];
    const vehiclesTable = document.getElementById('vehiclesTable').getElementsByTagName('tbody')[0];
    const residentForm = document.getElementById('residentForm');
    const vehicleForm = document.getElementById('vehicleForm');
    const vehicleResidentSelect = document.getElementById('vehicleResident');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-bar button');

    // Inicialização
    loadInitialData();
    setupEventListeners();
    adjustLayout();

    // Funções principais
    async function loadInitialData() {
        await loadResidents();
        await loadVehicles();
        updateChart();
    }

    async function loadResidents() {
        try {
            const response = await fetch(`${API_BASE_URL}/moradores`);
            if (!response.ok) throw new Error('Erro ao carregar moradores');
            residents = await response.json();
            updateResidentsTable();
            updateVehicleResidentOptions();
        } catch (error) {
            console.error('Erro ao carregar moradores:', error);
            showAlert('error', 'Falha ao carregar moradores');
        }
    }

    async function loadVehicles() {
        try {
            const response = await fetch(`${API_BASE_URL}/veiculos`);
            if (!response.ok) throw new Error('Erro ao carregar veículos');
            vehicles = await response.json();
            updateVehiclesTable();
        } catch (error) {
            console.error('Erro ao carregar veículos:', error);
            showAlert('error', 'Falha ao carregar veículos');
        }
    }

    function setupEventListeners() {
        setupModals();
        
        // Formulário de morador
        residentForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            await handleResidentFormSubmit();
        });

        // Formulário de veículo
        vehicleForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            await handleVehicleFormSubmit();
        });

        // Busca
        searchButton.addEventListener('click', searchData);
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') searchData();
        });

        // Redimensionamento
        window.addEventListener('resize', adjustLayout);
    }

    function setupModals() {
        // Elementos dos modais
        const editResidentModal = document.getElementById('editResidentModal');
        const editVehicleModal = document.getElementById('editVehicleModal');
        const closeButtons = document.querySelectorAll('.close-modal');
        
        // Fechar modal ao clicar no X
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                editResidentModal.style.display = 'none';
                editVehicleModal.style.display = 'none';
            });
        });
        
        // Fechar modal ao clicar fora da área do modal
        window.addEventListener('click', (event) => {
            if (event.target === editResidentModal) {
                editResidentModal.style.display = 'none';
            }
            if (event.target === editVehicleModal) {
                editVehicleModal.style.display = 'none';
            }
        });
        
        // Fechar modal com tecla ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                editResidentModal.style.display = 'none';
                editVehicleModal.style.display = 'none';
            }
        });
        
        // Formulário de edição de morador
        document.getElementById('editResidentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await updateResident();
        });
        
        // Formulário de edição de veículo
        document.getElementById('editVehicleForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await updateVehicle();
        });
    }

    async function handleResidentFormSubmit() {
        const name = document.getElementById('residentName').value.trim();
        const block = document.getElementById('residentBlock').value.trim();
        const phone = document.getElementById('residentPhone').value.trim();
        const email = document.getElementById('residentEmail').value.trim();
        const status = document.getElementById('residentStatus').value;

        if (!name || !block || !phone) {
            showAlert('error', 'Preencha todos os campos obrigatórios');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/moradores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: name,
                    bloco: block.split(',')[0].trim(),
                    apartamento: block.split(',')[1]?.trim() || '',
                    telefone: phone,
                    email: email,
                    status: status
                })
            });

            if (!response.ok) throw new Error('Erro ao adicionar morador');

            const newResident = await response.json();
            residents.push(newResident);
            updateResidentsTable();
            updateVehicleResidentOptions();
            residentForm.reset();
            showAlert('success', 'Morador cadastrado com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar morador:', error);
            showAlert('error', 'Falha ao cadastrar morador');
        }
    }

    async function handleVehicleFormSubmit() {
        const plate = document.getElementById('vehiclePlate').value.trim();
        const model = document.getElementById('vehicleModel').value.trim();
        const color = document.getElementById('vehicleColor').value.trim();
        const residentName = document.getElementById('vehicleResident').value;
        const spot = document.getElementById('vehicleSpot').value.trim();

        if (!plate || !model || !color || !residentName || !spot) {
            showAlert('error', 'Preencha todos os campos obrigatórios');
            return;
        }

        const resident = residents.find(r => r.nome === residentName);
        if (!resident) {
            showAlert('error', 'Morador não encontrado');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/veiculos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    placa: plate,
                    modelo: model,
                    cor: color,
                    morador_id: resident.id,
                    box: spot
                })
            });

            if (!response.ok) throw new Error('Erro ao adicionar veículo');

            const newVehicle = await response.json();
            newVehicle.resident = resident.nome; // Para exibição na tabela
            vehicles.push(newVehicle);
            updateVehiclesTable();
            vehicleForm.reset();
            showAlert('success', 'Veículo cadastrado com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar veículo:', error);
            showAlert('error', 'Falha ao cadastrar veículo');
        }
    }

    // Atualização de tabelas e gráficos
    function updateResidentsTable(filteredResidents = residents) {
        residentsTable.innerHTML = '';
        
        if (filteredResidents.length === 0) {
            const row = residentsTable.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 5;
            cell.textContent = 'Nenhum morador encontrado';
            cell.style.textAlign = 'center';
            return;
        }

        filteredResidents.forEach(resident => {
            const row = residentsTable.insertRow();
            row.insertCell().textContent = resident.nome;
            row.insertCell().textContent = `${resident.bloco}${resident.apartamento ? ', ' + resident.apartamento : ''}`;
            row.insertCell().textContent = `${resident.telefone}${resident.email ? '\n' + resident.email : ''}`;
            row.insertCell().textContent = resident.status;
            
            const actionsCell = row.insertCell();
            actionsCell.innerHTML = `
                <button class="btn-edit" onclick="editResident(${resident.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-delete" onclick="deleteResident(${resident.id})">
                    <i class="bi bi-trash"></i>
                </button>
            `;
        });
        
        updateChart();
    }

    function updateVehiclesTable(filteredVehicles = vehicles) {
        vehiclesTable.innerHTML = '';
        
        if (filteredVehicles.length === 0) {
            const row = vehiclesTable.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 6;
            cell.textContent = 'Nenhum veículo encontrado';
            cell.style.textAlign = 'center';
            return;
        }

        filteredVehicles.forEach(vehicle => {
            const resident = residents.find(r => r.id === vehicle.morador_id);
            const row = vehiclesTable.insertRow();
            row.insertCell().textContent = vehicle.placa;
            row.insertCell().textContent = vehicle.modelo;
            row.insertCell().textContent = vehicle.cor;
            row.insertCell().textContent = resident ? resident.nome : 'N/A';
            row.insertCell().textContent = vehicle.box;
            
            const actionsCell = row.insertCell();
            actionsCell.innerHTML = `
                    <button class="btn-edit" onclick="editVehicle(${vehicle.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteVehicle(${vehicle.id})">
                        <i class="bi bi-trash"></i>
                    </button>
            `;
        });
    }

    function updateVehicleResidentOptions() {
        vehicleResidentSelect.innerHTML = '<option value="">Selecione um morador</option>';
        
        residents.forEach(resident => {
            const option = document.createElement('option');
            option.value = resident.nome;
            option.textContent = resident.nome;
            vehicleResidentSelect.appendChild(option);
        });
    }

    function updateChart() {
        const blockCounts = {};
        residents.forEach(resident => {
            const block = resident.bloco || 'Sem bloco';
            blockCounts[block] = (blockCounts[block] || 0) + 1;
        });

        const ctx = document.getElementById('residentsChart').getContext('2d');
        
        // Destrói o gráfico anterior se existir
        if (residentsChart) {
            residentsChart.destroy();
        }

        residentsChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(blockCounts),
                datasets: [{
                    data: Object.values(blockCounts),
                    backgroundColor: [
                        '#05445E', 
                        '#189AB4', 
                        '#75E6DA', 
                        '#D4F1F4',
                        '#007bff',
                        '#0056b3'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Funções de busca
    function searchData() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (!searchTerm) {
            updateResidentsTable();
            updateVehiclesTable();
            return;
        }

        const filteredResidents = residents.filter(resident => 
            resident.nome.toLowerCase().includes(searchTerm) ||
            (resident.bloco && resident.bloco.toLowerCase().includes(searchTerm)) ||
            (resident.apartamento && resident.apartamento.toLowerCase().includes(searchTerm)) ||
            (resident.telefone && resident.telefone.toLowerCase().includes(searchTerm)) ||
            (resident.email && resident.email.toLowerCase().includes(searchTerm)) ||
            (resident.status && resident.status.toLowerCase().includes(searchTerm))
        );

        const filteredVehicles = vehicles.filter(vehicle => 
            (vehicle.placa && vehicle.placa.toLowerCase().includes(searchTerm)) ||
            (vehicle.modelo && vehicle.modelo.toLowerCase().includes(searchTerm)) ||
            (vehicle.cor && vehicle.cor.toLowerCase().includes(searchTerm)) ||
            (vehicle.box && vehicle.box.toLowerCase().includes(searchTerm)) ||
            residents.some(r => r.id === vehicle.morador_id && r.nome.toLowerCase().includes(searchTerm))
        );

        updateResidentsTable(filteredResidents);
        updateVehiclesTable(filteredVehicles);
    }

    // Funções globais para edição/exclusão
    window.editResident = function(id) {
        const resident = residents.find(r => r.id === id);
        if (!resident) return;
        
        currentResidentId = id;
        
        // Preencher o formulário do modal
        document.getElementById('editResidentName').value = resident.nome;
        document.getElementById('editResidentBlock').value = `${resident.bloco}${resident.apartamento ? ', ' + resident.apartamento : ''}`;
        document.getElementById('editResidentPhone').value = resident.telefone;
        document.getElementById('editResidentEmail').value = resident.email || '';
        document.getElementById('editResidentStatus').value = resident.status;
        document.getElementById('editResidentId').value = resident.id;
        
        // Mostrar o modal
        document.getElementById('editResidentModal').style.display = 'block';
    };

    window.editVehicle = function(id) {
        const vehicle = vehicles.find(v => v.id === id);
        if (!vehicle) return;
        
        currentVehicleId = id;
        
        const resident = residents.find(r => r.id === vehicle.morador_id);
        
        // Preencher o formulário do modal
        document.getElementById('editVehiclePlate').value = vehicle.placa;
        document.getElementById('editVehicleModel').value = vehicle.modelo;
        document.getElementById('editVehicleColor').value = vehicle.cor;
        document.getElementById('editVehicleSpot').value = vehicle.box;
        document.getElementById('editVehicleId').value = vehicle.id;
        
        // Atualizar opções do morador associado
        const select = document.getElementById('editVehicleResident');
        select.innerHTML = '';
        residents.forEach(r => {
            const option = document.createElement('option');
            option.value = r.id;
            option.textContent = r.nome;
            if (resident && r.id === resident.id) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        
        // Mostrar o modal
        document.getElementById('editVehicleModal').style.display = 'block';
    };

    async function updateResident() {
        const id = currentResidentId;
        const name = document.getElementById('editResidentName').value.trim();
        const block = document.getElementById('editResidentBlock').value.trim();
        const phone = document.getElementById('editResidentPhone').value.trim();
        const email = document.getElementById('editResidentEmail').value.trim();
        const status = document.getElementById('editResidentStatus').value;
        
        if (!name || !block || !phone) {
            showAlert('error', 'Preencha todos os campos obrigatórios');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/moradores/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: name,
                    bloco: block.split(',')[0].trim(),
                    apartamento: block.split(',')[1]?.trim() || '',
                    telefone: phone,
                    email: email,
                    status: status
                })
            });
            
            if (!response.ok) throw new Error('Erro ao atualizar morador');
            
            // Atualizar a lista de moradores
            await loadResidents();
            document.getElementById('editResidentModal').style.display = 'none';
            showAlert('success', 'Morador atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar morador:', error);
            showAlert('error', 'Falha ao atualizar morador');
        }
    }

    async function updateVehicle() {
        const id = currentVehicleId;
        const plate = document.getElementById('editVehiclePlate').value.trim();
        const model = document.getElementById('editVehicleModel').value.trim();
        const color = document.getElementById('editVehicleColor').value.trim();
        const residentId = document.getElementById('editVehicleResident').value;
        const spot = document.getElementById('editVehicleSpot').value.trim();
        
        if (!plate || !model || !color || !residentId || !spot) {
            showAlert('error', 'Preencha todos os campos obrigatórios');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/veiculos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    placa: plate,
                    modelo: model,
                    cor: color,
                    morador_id: residentId,
                    box: spot
                })
            });
            
            if (!response.ok) throw new Error('Erro ao atualizar veículo');
            
            // Atualizar a lista de veículos
            await loadVehicles();
            document.getElementById('editVehicleModal').style.display = 'none';
            showAlert('success', 'Veículo atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar veículo:', error);
            showAlert('error', 'Falha ao atualizar veículo');
        }
    }

    window.deleteResident = async function(id) {
        if (!confirm('Tem certeza que deseja excluir este morador?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/moradores/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Erro ao excluir morador');

            residents = residents.filter(r => r.id !== id);
            vehicles = vehicles.filter(v => {
                const resident = residents.find(r => r.id === v.morador_id);
                return resident !== undefined;
            });
            
            updateResidentsTable();
            updateVehiclesTable();
            updateVehicleResidentOptions();
            showAlert('success', 'Morador excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir morador:', error);
            showAlert('error', 'Falha ao excluir morador');
        }
    };

    window.deleteVehicle = async function(id) {
        if (!confirm('Tem certeza que deseja excluir este veículo?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/veiculos/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Erro ao excluir veículo');

            vehicles = vehicles.filter(v => v.id !== id);
            updateVehiclesTable();
            showAlert('success', 'Veículo excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir veículo:', error);
            showAlert('error', 'Falha ao excluir veículo');
        }
    };

    // Funções auxiliares
    function adjustLayout() {
        const tablesContainer = document.querySelector('.tables-container');
        const formsContainer = document.querySelector('.forms-container');
    
        if (window.innerWidth < 768) {
            tablesContainer.style.flexDirection = 'column';
            formsContainer.style.flexDirection = 'column';
        } else {
            tablesContainer.style.flexDirection = 'row';
            formsContainer.style.flexDirection = 'row';
        }
    }

    function showAlert(type, message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.classList.add('fade-out');
            setTimeout(() => alertDiv.remove(), 500);
        }, 3000);
    }
});