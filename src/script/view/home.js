async function addNote() {
  const title = document.getElementById("title").value;
  const body = document.getElementById("description").value;

  const loadingIndicator = document.querySelector("custom-loading-indicator");
  loadingIndicator.style.display = "block";

  try {
    const response = await fetch("https://notes-api.dicoding.dev/v2/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        body: body,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      showToast("Catatan berhasil ditambahkan");
      clearForm();
      await loadNotes();
      const newNote = document.querySelector(".note:last-child");
      animateNoteEntry(newNote);
      const modalBg = document.getElementById("modalBg");
      modalBg.style.display = "none";
    } else {
      throw new Error("Gagal menambahkan catatan");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Gagal menambahkan catatan");
  } finally {
    loadingIndicator.style.display = "none";
  }
}

async function deleteNoteById(noteId) {
  const loadingIndicator = document.querySelector("custom-loading-indicator");
  loadingIndicator.style.display = "block";

  try {
    const confirmation = confirm(
      "Apakah Anda yakin ingin menghapus catatan ini?"
    );
    if (!confirmation) {
      return;
    }

    const response = await fetch(
      `https://notes-api.dicoding.dev/v2/notes/${noteId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      showToast("Catatan berhasil dihapus");
      const deletedNote = document.querySelector(`.note[data-id="${noteId}"]`);
      animateNoteRemoval(deletedNote);
      loadArchivedNotes();
    } else {
      throw new Error("Gagal menghapus catatan");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Gagal menghapus catatan");
  } finally {
    loadingIndicator.style.display = "none";
  }
}

async function archiveNoteById(noteId) {
  const loadingIndicator = document.querySelector("custom-loading-indicator");
  loadingIndicator.style.display = "block";

  try {
    const confirmation = confirm("Apakah Anda yakin ingin mengarsipkan catatan ini?");
    if (!confirmation) {
      return;
    }

    const response = await fetch(
      `https://notes-api.dicoding.dev/v2/notes/${noteId}/archive`,
      {
        method: "POST",
      }
    );

    if (response.ok) {
      showToast("Catatan berhasil diarsipkan");
      await loadNotes();
      loadArchivedNotes();
    } else {
      throw new Error("Gagal mengarsipkan catatan");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Gagal mengarsipkan catatan");
  } finally {
    setTimeout(() => {
      loadingIndicator.style.display = "none";
    }, 6000);
  }
}
async function unarchiveNoteById(noteId) {
  const confirmation = confirm("Apakah Anda yakin ingin mengembalikan catatan ini dari arsip?");
  if (!confirmation) {
    return; 
  }

  const loadingIndicator = document.querySelector("custom-loading-indicator");
  loadingIndicator.style.display = "block";

  try {
    const response = await fetch(
      `https://notes-api.dicoding.dev/v2/notes/${noteId}/unarchive`,
      {
        method: "POST",
      }
    );

    if (response.ok) {
      showToast("Catatan berhasil diunarsipkan");
      loadNotes();
      loadArchivedNotes();
    } else {
      throw new Error("Gagal mengembalikan catatan dari arsip");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Gagal mengembalikan catatan dari arsip");
  } finally {
    setTimeout(() => {
      loadingIndicator.style.display = "none";
    }, 6000);
  }
}
async function loadNotes() {
  try {
    const loadingIndicator = document.querySelector("custom-loading-indicator");
    loadingIndicator.style.display = "block";

    const response = await fetch("https://notes-api.dicoding.dev/v2/notes");
    if (response.ok) {
      const data = await response.json();
      const notesList = document.getElementById("notesList");
      notesList.innerHTML = "";
      data.data.forEach((note) => {
        notesList.appendChild(makeNoteCard(note));
      });
    } else {
      throw new Error("Gagal memuat catatan");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Gagal memuat catatan");
  } finally {
    const loadingIndicator = document.querySelector("custom-loading-indicator");
    loadingIndicator.style.display = "none";
  }
}

async function loadArchivedNotes() {
  try {
    const loadingIndicator = document.querySelector("custom-loading-indicator");
    loadingIndicator.style.display = "block";

    const response = await fetch(
      "https://notes-api.dicoding.dev/v2/notes/archived"
    );
    if (response.ok) {
      const data = await response.json();
      const archivedNotesList = document.getElementById("archivedNotesList");
      archivedNotesList.innerHTML = "";
      data.data.forEach((note) => {
        archivedNotesList.appendChild(makeNoteCard(note));
      });
    } else {
      throw new Error("Gagal memuat catatan yang diarsipkan");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Gagal memuat catatan yang diarsipkan");
  } finally {
    const loadingIndicator = document.querySelector("custom-loading-indicator");
    loadingIndicator.style.display = "none";
  }
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(function () {
    document.body.removeChild(toast);
  }, 4000);
}

function openModal(note) {
  const modalBgNote = document.querySelector("#modalBgNote");
  const modalTitle = modalBgNote.querySelector("#modalBgTitle");
  const modalBody = modalBgNote.querySelector("#modalBgBody");

  modalTitle.innerText = note.title;
  modalBody.innerText = note.body;

  modalBgNote.style.display = "block";
}

function validateTitle(title) {
  const titleInput = document.getElementById("title");
  const titleErrorMessage = document.getElementById("titleErrorMessage");

  if (!title.trim()) {
    titleErrorMessage.textContent = "Judul harus diisi!";
    titleInput.classList.add("error");
    return false;
  } else {
    titleErrorMessage.textContent = "";
    titleInput.classList.remove("error");
    return true;
  }
}

function validateDescription(description) {
  const descriptionInput = document.getElementById("description");
  const descriptionErrorMessage = document.getElementById(
    "descriptionErrorMessage"
  );

  if (!description.trim()) {
    descriptionErrorMessage.textContent = "Deskripsi harus diisi!";
    descriptionInput.classList.add("error");
    return false;
  } else {
    descriptionErrorMessage.textContent = "";
    descriptionInput.classList.remove("error");
    return true;
  }
}

function clearFormValidation() {
  const titleInput = document.getElementById("title");
  const titleErrorMessage = document.getElementById("titleErrorMessage");
  const descriptionInput = document.getElementById("description");
  const descriptionErrorMessage = document.getElementById(
    "descriptionErrorMessage"
  );

  titleErrorMessage.textContent = "";
  descriptionErrorMessage.textContent = "";

  titleInput.classList.remove("error");
  descriptionInput.classList.remove("error");
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
}

function animateNoteEntry(noteElement) {
  anime({
    targets: noteElement,
    opacity: [0, 1],
    translateY: [-20, 0],
    duration: 500,
    easing: "easeOutQuad",
  });
}

function animateNoteRemoval(noteElement) {
  anime({
    targets: noteElement,
    opacity: [1, 0],
    translateY: [0, -20],
    duration: 500,
    easing: "easeInQuad",
    complete: function (anim) {
      noteElement.remove();
    },
  });
}

function makeNoteCard(note) {
  const noteCard = document.createElement("div");
  noteCard.classList.add("note");
  noteCard.dataset.id = note.id;

  const title = document.createElement("h3");
  title.innerText = note.title;

  const body = document.createElement("p");
  body.innerText = note.body;

  noteCard.addEventListener("click", function () {
    openModal(note);
  });

  const separator = document.createElement("hr");

  const createdAt = document.createElement("p");
  const createdAtDate = new Date(note.createdAt);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  createdAt.innerText = `${createdAtDate.toLocaleDateString("en-US", options)}`;

  const actionButtons = document.createElement("div");
  actionButtons.classList.add("action-buttons");

  const ellipsisButton = document.createElement("button");
  ellipsisButton.innerHTML = '<i class="fas fa-ellipsis-v"></i>';
  ellipsisButton.classList.add("ellipsis-button");

  const menu = document.createElement("ul");
  menu.classList.add("menu");

  let deleteMenuItem, archiveMenuItem;

  deleteMenuItem = document.createElement("li");
  deleteMenuItem.classList.add("delete-menu-item");
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fas", "fa-trash-alt");
  const deleteText = document.createTextNode(" Delete");
  deleteMenuItem.appendChild(deleteIcon);
  deleteMenuItem.appendChild(deleteText);
  deleteMenuItem.addEventListener("click", function (event) {
    event.stopPropagation();
    deleteNoteById(note.id);
  });

  if (note.archived) {
    archiveMenuItem = document.createElement("li");
    archiveMenuItem.classList.add("archive-menu-item");
    const archiveIcon = document.createElement("i");
    archiveIcon.classList.add("fas", "fa-archive");
    const archiveText = document.createTextNode(" Unarchive");
    archiveMenuItem.appendChild(archiveIcon);
    archiveMenuItem.appendChild(archiveText);
    archiveMenuItem.addEventListener("click", function (event) {
      event.stopPropagation();
      unarchiveNoteById(note.id);
    });
  } else {
    archiveMenuItem = document.createElement("li");
    archiveMenuItem.classList.add("archive-menu-item");
    const archiveIcon = document.createElement("i");
    archiveIcon.classList.add("fas", "fa-archive");
    const archiveText = document.createTextNode(" Archive");
    archiveMenuItem.appendChild(archiveIcon);
    archiveMenuItem.appendChild(archiveText);
    archiveMenuItem.addEventListener("click", function (event) {
      event.stopPropagation();
      archiveNoteById(note.id);
    });
  }

  menu.appendChild(deleteMenuItem);
  if (archiveMenuItem) {
    menu.appendChild(archiveMenuItem);
  }

  ellipsisButton.addEventListener("click", function (event) {
    event.stopPropagation();
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  });
  menu.addEventListener("mouseleave", function () {
    menu.style.display = "none";
  });

  actionButtons.appendChild(ellipsisButton);
  actionButtons.appendChild(menu);

  noteCard.appendChild(title);
  noteCard.appendChild(body);
  noteCard.appendChild(separator);
  noteCard.appendChild(createdAt);
  noteCard.appendChild(actionButtons);

  return noteCard;
}

document.addEventListener("DOMContentLoaded", function () {
  loadNotes();
  loadArchivedNotes();

  const newNote = document.querySelector(".note:last-child");
  animateNoteEntry(newNote);

  const addButton = document.getElementById("addButton");
  addButton.addEventListener("click", function () {
    const modalBg = document.getElementById("modalBg");
    modalBg.style.display = "block";
  });

  const closeButton = document.getElementById("closeButton");
  closeButton.addEventListener("click", function () {
    const modalBg = document.getElementById("modalBg");
    modalBg.style.display = "none";
    clearFormValidation();
  });

  const closeButtonBg = document.getElementById("closeButtonBg");
  closeButtonBg.addEventListener("click", function () {
    const modalBgNote = document.getElementById("modalBgNote");
    modalBgNote.style.display = "none";
  });
  const titleInput = document.getElementById("title");
  const titleErrorMessage = document.getElementById("titleErrorMessage");

  const descriptionInput = document.getElementById("description");
  const descriptionErrorMessage = document.getElementById(
    "descriptionErrorMessage"
  );

  titleInput.addEventListener("input", function () {
    validateTitle(titleInput.value);
  });

  descriptionInput.addEventListener("input", function () {
    validateDescription(descriptionInput.value);
  });

  titleInput.addEventListener("focusout", function () {
    validateTitle(titleInput.value);
  });

  descriptionInput.addEventListener("focusout", function () {
    validateDescription(descriptionInput.value);
  });

  const submitForm = document.getElementById("noteForm");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const titleValid = validateTitle(titleInput.value);
    const descriptionValid = validateDescription(descriptionInput.value);
    if (titleValid && descriptionValid) {
      addNote();
    }
  });
});
