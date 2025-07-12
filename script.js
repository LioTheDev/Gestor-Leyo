
const validUser = "admin";
const validPass = "1234";


let tasks = [];          
let currentEditIndex = -1; 


function login() {
    try {
        const u = val("username").value, p = val("password").value;
        if (u === validUser && p === validPass) {
            show("loginSection", false);
            show("appSection", true);
            val("displayUser").textContent = u;
        } else { val("loginError").textContent = "Credenciales inválidas"; }
    } catch (e) { console.error(e); }
}

function addTask() {
    try {
        const task = {
            id: field("taskId"),
            title: field("taskTitle"),
            desc: field("taskDesc"),
            date: field("taskStartDate"),
            client: field("clientName"),
            projectId: field("projectId"),
            comments: field("taskComments"),
            status: "Por hacer"
        };

        if (Object.values(task).some(v => !v)) { alert("Todos los campos son obligatorios"); return false; }

        tasks.push(task);           
        renderTable();              
        clearForm();                
    } catch (e) { console.error(e); }
    return false;                
}


function renderTable() {
    const tbody = val("taskTable").querySelector("tbody");
    tbody.innerHTML = ""; 
    tasks.forEach((t, i) => {
        if (!passesFilter(t.status)) return; 
        const row = tbody.insertRow();
        row.ondblclick = () => loadForEdit(i); 
        Object.values(t).forEach(v => row.insertCell().textContent = v);
    });
}


function loadForEdit(index) {
    currentEditIndex = index;
    const t = tasks[index];
    show("editSection", true);
    ["Id", "Title", "Desc", "Date", "Client", "Project"].forEach(k => {
        val("edit" + k).textContent = t[k.toLowerCase()];
    });
    val("editStatus").value = t.status;
    val("newComment").value = "";
}

val("updateBtn").onclick = function () {
    if (currentEditIndex < 0) return;
    const t = tasks[currentEditIndex];
    t.status = val("editStatus").value;
    const extra = val("newComment").value.trim();
    if (extra) {
        const stamp = new Date().toLocaleString();
        t.comments += `\n[${stamp}] ${extra}`;
    }
    renderTable();
    show("editSection", false);
};

function applyFilter() { renderTable(); }
function passesFilter(status) {
    const f = val("filterStatus").value;
    return (f === "Todos" || f === status);
}

function val(id) { return document.getElementById(id); }
function field(id) { return val(id).value.trim(); }
function show(id, flag) { val(id).style.display = flag ? "block" : "none"; }
function clearForm() {
    val("taskForm").reset();
    val("taskStatus").value = "Por hacer";
}


