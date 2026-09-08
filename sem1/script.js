const days = ["Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан"];
const periods = 6;

const scheduleData = [
  {
    number: 1,
    code: "8020",
    name: "Б.Тулга",
    classes: {
      "0-3": "IOI121\nГ-Бүгд\nC-402",
      "1-1": "UFE\nB-402a",
      "1-2": "UFE\nB-402a",
      "3-1": "UFE\nB-402a",
      "3-2": "UFE\nB-402a",
    },
  },
  {
    number: 2,
    code: "8030",
    name: "Б.Оргил",
    classes: {
      "0-2": "IOI113\nГ-Бүгд\nC-402",
      "1-3": "IOI113\nio204\nB-402a",
      "1-4": "IOI113\nio204\nB-402a",
    },
  },
  {
    number: 3,
    code: "",
    name: "М.Цэцэнцэнгэл",
    classes: { "0-4": "IOI122\nГ-Бүгд\nC-402" },
  },
  {
    number: 4,
    code: "",
    name: "С.Уугандорж",
    classes: { "1-3": "IOI113\nio203\nB-402b", "1-4": "IOI113\nio203\nB-402b" },
  },
  {
    number: 5,
    code: "",
    name: "Л.Лхагвадорж",
    classes: {
      "1-1": "IOI113\nio201\nB-402b",
      "1-2": "IOI113\nio201\nB-402b",
      "2-3": "IOI113\nio202\nB-402a",
      "2-4": "IOI113\nio202\nB-402a",
    },
  },
    {
      number: 6,
      code: "8040",
      name: "А.Мөнх-Уурал",
      classes: { "3-3": "IOI121\nio205\nB-402a", "3-4": "IOI121\nio205\nB-402a" },
  },
  {
    number: 7,
    code: "",
    name: "С.Сайнбаяр",
    classes: { "4-3": "IOI121\nio208\nB-402a", "4-4": "IOI121\nio208\nB-402a" },
  },
  {
    number: 8,
    code: "",
    name: "Б.Удвал",
    classes: {
      "4-1": "IOI121\nio206\nB-402b",
      "4-2": "IOI121\nio206\nB-402b",
      "4-3": "IOI121\nio207\nB-402b",
      "4-4": "IOI121\nio207\nB-402b",
    },
  },
  {
    number: 9,
    code: "",
    name: "Х.Түмэнхүсэлэн",
    classes: {
      "2-1": "IOI122\nio209\nB-402b",
      "2-2": "IOI122\nio209\nB-402b",
      "2-3": "IOI122\nio212\nB-402b",
      "2-4": "IOI122\nio212\nB-402b",
    },
  },
  {
    number: 10,
    code: "",
    name: "Д.Төмөрчөдөр",
    classes: {
      "3-1": "IOI122\nio210\nB-402b",
      "3-2": "IOI122\nio210\nB-402b",
      "3-3": "IOI122\nio211\nB-402b",
      "3-4": "IOI122\nio211\nB-402b",
    },
  },
];

const tableHead = document.querySelector("#schedule-table thead");
const tableBody = document.querySelector("#schedule-body");
const searchInput = document.querySelector("#student-search");
const countLabel = document.querySelector("#student-count");

function buildHeader() {
  const dayRow = document.createElement("tr");
  dayRow.innerHTML =
    '<th class="fixed-column number-column" rowspan="2">№</th><th class="fixed-column code-column" rowspan="2">Код</th><th class="fixed-column name-column" rowspan="2">Багшийн<br>нэр</th>';
  days.forEach((day, dayIndex) => {
    const header = document.createElement("th");
    header.colSpan = periods;
    header.textContent = day;
    header.className = `day-${dayIndex % 2 ? "tuesday" : "monday"}`;
    dayRow.append(header);
  });

  const periodRow = document.createElement("tr");
  days.forEach((_, dayIndex) => {
    for (let period = 1; period <= periods; period += 1) {
      const header = document.createElement("th");
      header.textContent = period;
      header.className = `day-${dayIndex % 2 ? "tuesday" : "monday"}`;
      periodRow.append(header);
    }
  });
  tableHead.append(dayRow, periodRow);
}

function buildBody() {
  scheduleData.forEach((student) => {
    const row = document.createElement("tr");
    row.dataset.student = student.name.toLocaleLowerCase();
    row.innerHTML = `<th scope="row" class="fixed-column number-column">${student.number}</th><td class="fixed-column code-column">${student.code}</td><th scope="row" class="fixed-column name-column student-name">${student.name}</th>`;

    days.forEach((_, dayIndex) => {
      for (let period = 1; period <= periods; period += 1) {
        const cell = document.createElement("td");
        const key = `${dayIndex}-${period - 1}`;
        cell.className = `class-cell day-${dayIndex % 2 ? "tuesday" : "monday"}`;
        cell.contentEditable = "true";
        cell.dataset.key = key;
        cell.textContent = student.classes[key] || "";
        cell.addEventListener("blur", () =>
          saveCell(student, key, cell.textContent),
        );
        row.append(cell);
      }
    });
    tableBody.append(row);
  });
}

function saveCell(student, key, value) {
  const cleanedValue = value.trim();
  if (cleanedValue) student.classes[key] = cleanedValue;
  else delete student.classes[key];
  localStorage.setItem("seminar-schedule", JSON.stringify(scheduleData));
}

function filterStudents() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  let visible = 0;
  tableBody.querySelectorAll("tr").forEach((row) => {
    const matches = row.dataset.student.includes(query);
    row.hidden = !matches;
    if (matches) visible += 1;
  });
  countLabel.textContent = visible;
}

function restoreSavedData() {
  const savedData = localStorage.getItem("seminar-schedule");
  if (!savedData) return;
  const savedStudents = JSON.parse(savedData);
  savedStudents.forEach((savedStudent, index) => {
    if (scheduleData[index]) scheduleData[index].classes = savedStudent.classes;
  });
}

restoreSavedData();
buildHeader();
buildBody();
filterStudents();
searchInput.addEventListener("input", filterStudents);
document.querySelector("#reset-search").addEventListener("click", () => {
  searchInput.value = "";
  filterStudents();
  searchInput.focus();
});
