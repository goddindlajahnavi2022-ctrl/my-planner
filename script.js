document.addEventListener("DOMContentLoaded", function () {

    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const addBtn = document.getElementById("addBtn");
    const taskDate = document.getElementById("taskDate");
    const startTimeInput = document.getElementById("startTime");
    const endTimeInput = document.getElementById("endTime");

    // Default date = today
    const today = new Date().toISOString().split("T")[0];
    taskDate.value = today;

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function calculateDuration(start, end) {
        if (!start || !end) return "—";

        const startMinutes = toMinutes(start);
        const endMinutes = toMinutes(end);

        if (endMinutes <= startMinutes) return "—";

        const diff = endMinutes - startMinutes;
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;

        return `${hours}h ${minutes}m`;
    }

    function toMinutes(time) {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    }

   function to12Hour(time) {
    if (time === "—") return "—";

    let [h, m] = time.split(":").map(Number);
    let period = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${String(h).padStart(2, "0")}:${m} ${period}`;
}

   function durationInMinutes(start, end) {
    if (!start || !end || start === "—" || end === "—") return "—";

    const diff = toMinutes(end) - toMinutes(start);
    return diff > 0 ? `${diff} min` : "—";
}

    function addTask() {
        const text = taskInput.value.trim();
        const date = taskDate.value;
        const startTime = startTimeInput.value || "—";
        const endTime = endTimeInput.value || "—";
        const duration = calculateDuration(startTime, endTime);

        if (text === "" || date === "") return;

        tasks.push({
            text,
            date,
            startTime,
            endTime,
            duration,
            done: false
        });

        taskInput.value = "";
        startTimeInput.value = "";
        endTimeInput.value = "";

        saveTasks();
        renderTasks();
    }

    function toggleTask(index) {
        tasks[index].done = !tasks[index].done;
        saveTasks();
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = "";
        const selectedDate = taskDate.value;

        let filteredTasks = tasks
            .filter(task => task.date === selectedDate)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

        if (filteredTasks.length === 0) {
            taskList.innerHTML = "<p>No tasks for this day 📭</p>";
            return;
        }

        filteredTasks.forEach(task => {
            const index = tasks.indexOf(task);

            let li = document.createElement("li");
            if (task.done) li.classList.add("done");

            let span = document.createElement("span");
            span.innerHTML = `
    <strong>
        ${to12Hour(task.startTime)} – ${to12Hour(task.endTime)}
        (${durationInMinutes(task.startTime, task.endTime)})
    </strong><br>
    ${task.text}
`;
            span.onclick = () => toggleTask(index);

            let delBtn = document.createElement("button");
            delBtn.textContent = "❌";
            delBtn.onclick = () => deleteTask(index);

            li.appendChild(span);
            li.appendChild(delBtn);
            taskList.appendChild(li);
        });
    }

    addBtn.addEventListener("click", addTask);
    taskDate.addEventListener("change", () => {
    renderWeek(taskDate.value);
    renderTasks();
});

    taskInput.addEventListener("keyup", function (e) {
        if (e.key === "Enter") addTask();
    });

    renderTasks();
    
    const goalInput = document.getElementById("goalInput");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalList = document.getElementById("goalList");

let goals = JSON.parse(localStorage.getItem("weeklyGoals")) || [];

function saveGoals() {
    localStorage.setItem("weeklyGoals", JSON.stringify(goals));
}

function renderGoals() {
    goalList.innerHTML = "";

    goals.forEach((goal, index) => {
        let li = document.createElement("li");

        let circle = document.createElement("div");
        circle.className = "goal-circle";
        if (goal.done) circle.classList.add("done");

        circle.onclick = () => {
            goals[index].done = !goals[index].done;
            saveGoals();
            renderGoals();
        };

        let text = document.createElement("span");
        text.textContent = goal.text;

        li.appendChild(circle);
        li.appendChild(text);
        goalList.appendChild(li);
    });
}

addGoalBtn.addEventListener("click", () => {
    if (goalInput.value.trim() === "") return;

    goals.push({ text: goalInput.value, done: false });
    goalInput.value = "";
    saveGoals();
    renderGoals();
});

renderGoals();
const weekStrip = document.getElementById("weekStrip");

function renderWeek(selectedDate) {
    weekStrip.innerHTML = "";

    const base = new Date(selectedDate);
    const sunday = new Date(base);
    sunday.setDate(base.getDate() - base.getDay()); // Sunday start

    for (let i = 0; i < 7; i++) {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);

        const dateStr = d.toISOString().split("T")[0];

        const box = document.createElement("div");
        box.className = "day-box";
        if (dateStr === taskDate.value) box.classList.add("active");

        box.innerHTML = `
            <div>${d.toLocaleDateString("en-US", { weekday: "short" })}</div>
            <strong>${d.getDate()}</strong>
        `;

        box.onclick = () => {
            taskDate.value = dateStr;
            renderWeek(dateStr);
            renderTasks();
        };

        weekStrip.appendChild(box);
    }
}

// Call initially
renderWeek(taskDate.value);
const bgColor = document.getElementById("bgColor");
const fontColor = document.getElementById("fontColor");
const fontSize = document.getElementById("fontSize");
const fontType = document.getElementById("fontType");

// Load saved settings
const savedSettings = JSON.parse(localStorage.getItem("settings")) || {};

applySettings(savedSettings);

bgColor.oninput = () => updateSettings();
fontColor.oninput = () => updateSettings();
fontSize.oninput = () => updateSettings();
fontType.onchange = () => updateSettings();

function updateSettings() {
    const settings = {
        bg: bgColor.value,
        color: fontColor.value,
        size: fontSize.value,
        font: fontType.value
    };
    localStorage.setItem("settings", JSON.stringify(settings));
    applySettings(settings);
}

function applySettings(s) {
    if (!s) return;
    document.body.style.background = s.bg || "";
    document.body.style.color = s.color || "";
    document.body.style.fontSize = s.size ? s.size + "px" : "";
    document.body.style.fontFamily = s.font || "";
}
});
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}