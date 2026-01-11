let employees = JSON.parse(localStorage.getItem('employees')) || [];
let employeeId = JSON.parse(localStorage.getItem('employeeId')) || 1;

// Initialize with sample data if empty
if (employees.length === 0) {
  employees = [
    {
      id: 1,
      name: 'John Doe',
      dept: 'Engineering',
      email: 'john.doe@company.com',
      phone: '+1-555-0123',
      attendance: 'Present',
      joinDate: '2024-01-15',
      photo: 'https://i.pravatar.cc/120?u=john',
      position: 'Senior Developer',
      salary: '$85,000'
    },
    {
      id: 2,
      name: 'Jane Smith',
      dept: 'HR',
      email: 'jane.smith@company.com',
      phone: '+1-555-0124',
      attendance: 'Absent',
      joinDate: '2024-02-01',
      photo: 'https://i.pravatar.cc/120?u=jane',
      position: 'HR Manager',
      salary: '$75,000'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      dept: 'Engineering',
      email: 'bob.johnson@company.com',
      phone: '+1-555-0125',
      attendance: 'Present',
      joinDate: '2024-01-20',
      photo: 'https://i.pravatar.cc/120?u=bob',
      position: 'Frontend Developer',
      salary: '$70,000'
    },
    {
      id: 4,
      name: 'Alice Brown',
      dept: 'Marketing',
      email: 'alice.brown@company.com',
      phone: '+1-555-0126',
      attendance: 'Present',
      joinDate: '2024-03-10',
      photo: 'https://i.pravatar.cc/120?u=alice',
      position: 'Marketing Specialist',
      salary: '$65,000'
    },
    {
      id: 5,
      name: 'Mike Wilson',
      dept: 'Finance',
      email: 'mike.wilson@company.com',
      phone: '+1-555-0127',
      attendance: 'Present',
      joinDate: '2024-02-15',
      photo: 'https://i.pravatar.cc/120?u=mike',
      position: 'Financial Analyst',
      salary: '$72,000'
    }
  ];
  employeeId = 6;
  localStorage.setItem('employees', JSON.stringify(employees));
  localStorage.setItem('employeeId', JSON.stringify(employeeId));
}

const role = localStorage.getItem('role');
const userEmail = localStorage.getItem('user');
document.getElementById('user').innerText = userEmail || 'User';

if(role!=='admin')document.getElementById('adminPanel').style.display='none';

function updateStats(){
  document.getElementById("total").innerText = employees.length;
  const present = employees.filter(e => e.attendance === "Present").length;
  const absent = employees.filter(e => e.attendance === "Absent").length;
  document.getElementById("present").innerText = present;
  document.getElementById("absent").innerText = absent;
  const depts = [...new Set(employees.map(e => e.dept))].filter(d => d);
  document.getElementById("departments").innerText = depts.length;

  // Calculate average salary
  const salaries = employees.map(e => parseFloat(e.salary.replace(/[$,]/g, ''))).filter(s => !isNaN(s));
  const avgSalary = salaries.length > 0 ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : 0;
  document.getElementById("avgSalary").innerText = `$${avgSalary.toLocaleString()}`;

  // Calculate attendance rate
  const attendanceRate = employees.length > 0 ? Math.round((present / employees.length) * 100) : 0;
  document.getElementById("attendanceRate").innerText = `${attendanceRate}%`;

  // Update department overview
  updateDeptOverview();
}

function updateDeptOverview(){
  const deptStats = {};
  employees.forEach(emp => {
    if (!deptStats[emp.dept]) {
      deptStats[emp.dept] = { total: 0, present: 0 };
    }
    deptStats[emp.dept].total++;
    if (emp.attendance === 'Present') {
      deptStats[emp.dept].present++;
    }
  });

  const overviewEl = document.getElementById('deptOverview');
  overviewEl.innerHTML = '';

  Object.keys(deptStats).forEach(dept => {
    const stats = deptStats[dept];
    const rate = Math.round((stats.present / stats.total) * 100);
    overviewEl.innerHTML += `
      <div class="dept-item">
        <span class="dept-name">${dept}</span>
        <span class="dept-stats">${stats.present}/${stats.total} (${rate}%)</span>
      </div>
    `;
  });
}

updateStats();

function addEmployee(){
  const name=document.getElementById('name').value.trim();
  const dept=document.getElementById('dept').value.trim();
  const email=document.getElementById('email').value.trim();
  const phone=document.getElementById('phone').value.trim();
  const position=document.getElementById('position').value.trim();
  const salary=document.getElementById('salary').value.trim();

  if(!name||!dept){
    alert('Please fill in Name and Department');
    return;
  }

  const employee = {
    id: employeeId++,
    name,
    dept,
    email: email || `${name.toLowerCase().replace(/\s+/g,'.')}@company.com`,
    phone: phone || 'N/A',
    attendance:'Absent',
    joinDate: new Date().toLocaleDateString(),
    photo: `https://i.pravatar.cc/120?u=${name.toLowerCase().replace(/\s+/g,'')}`,
    position: position || 'Employee',
    salary: salary || '$50,000'
  };

  employees.push(employee);
  save();
  // Clear form
  document.getElementById('name').value = '';
  document.getElementById('dept').value = '';
  document.getElementById('email').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('position').value = '';
  document.getElementById('salary').value = '';
}

function toggleAttendance(i){
  employees[i].attendance=employees[i].attendance==='Present'?'Absent':'Present';
  save();
}

function editEmployee(i){
  const name=prompt('Edit name',employees[i].name);
  const dept=prompt('Edit department',employees[i].dept);
  const email=prompt('Edit email',employees[i].email);
  const phone=prompt('Edit phone',employees[i].phone);
  const position=prompt('Edit position',employees[i].position || 'Employee');
  const salary=prompt('Edit salary',employees[i].salary || '$50,000');
  if(name&&dept){
    employees[i].name=name;
    employees[i].dept=dept;
    employees[i].email=email || employees[i].email;
    employees[i].phone=phone || employees[i].phone;
    employees[i].position=position || employees[i].position;
    employees[i].salary=salary || employees[i].salary;
    save();
  }
}

function deleteEmployee(i){
  if(confirm(`Delete ${employees[i].name}? This action cannot be undone.`)){
    employees.splice(i,1);
    save();
  }
}

function searchEmployee(){
  const q=document.getElementById('search').value.toLowerCase();
  render(employees.filter(e=>e.name.toLowerCase().includes(q)||e.dept.toLowerCase().includes(q)||e.email.toLowerCase().includes(q)));
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function viewEmployee(index) {
  localStorage.setItem("selectedEmp", JSON.stringify(employees[index]));
  window.location.href = "employee.html";
}

function logout(){
  if(confirm('Are you sure you want to logout?')){
    localStorage.clear();
    window.location.href = 'index.html';
  }
}

function save(){
  localStorage.setItem('employees', JSON.stringify(employees));
  localStorage.setItem('employeeId', JSON.stringify(employeeId));
  updateStats();
  render(employees);
}

function render(data){
  const body=document.getElementById('tableBody');body.innerHTML='';
  data.forEach((e,i)=>{
    body.innerHTML+=`
    <tr>
      <td>${e.id}</td>
      <td>${e.name}</td>
      <td>${e.dept}</td>
      <td>${e.position || 'Employee'}</td>
      <td>${e.salary || '$50,000'}</td>
      <td onclick="toggleAttendance(${i})"><span class="badge ${e.attendance==='Present'?'present':'absent'}">${e.attendance}</span></td>
      <td>
        <button class="action-btn view" onclick="viewEmployee(${i})">👁️ View</button>
        ${role==='admin'?'<button class="action-btn edit" onclick="editEmployee(${i})">✏️ Edit</button><button class="action-btn delete" onclick="deleteEmployee(${i})">🗑️ Delete</button>':''}
      </td>
    </tr>`;
  })
}

// Load theme
if(localStorage.getItem('theme') === 'dark'){
  document.body.classList.add('dark');
}

render(employees);