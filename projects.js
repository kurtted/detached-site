/**
 * ==========================================================================
 * PROJECTS CONFIGURATION / КОНФИГУРАЦИЯ ПРОЕКТОВ
 * ==========================================================================
 * 
 * Здесь вы можете легко добавлять, изменять и удалять свои проекты!
 * Достаточно скопировать один из блоков ниже и заполнить своими данными.
 * 
 * ПОЛЯ (FIELDS):
 * - name:        Название проекта (строка).
 * - status:      Статус разработки. Доступные варианты:
 *                1. "done"       -> Завершён (зелёный цвет)
 *                2. "in-dev"     -> В разработке (янтарный цвет с анимацией пульса)
 *                3. "planned"    -> Запланирован (голубой / неоновый циан)
 *                4. "archived"   -> В архиве / Заброшен (приглушённый серый цвет)
 * - date:        Дата или период создания (строка). Можно оставить пустым: ""
 * - description: Описание проекта и его функций:
 *                - en: Описание на английском языке
 *                - ru: Описание на русском языке
 * - tags:        Список технологий / тегов (массив строк, например ["Java", "Paper API"])
 * - link:        Ссылка на проект (GitHub, сайт, Telegram). Если ссылки нет, оставьте: ""
 */

const PROJECTS_CONFIG = [
    {
    name: "FrogTickets",
    status: "done",
    date: "2026",
    description: {
      en: "A Discord bot for handling user inquiries — creating tickets",
      ru: "Дискорд бот для работы с обращениями пользователей - создание тикетов"
    },
    tags: ["Python", "discord.py", "sqlite3"],
    link: ""
  },
    {
    name: "FrogMC Launcher",
    status: "done",
    date: "2026",
    description: {
      en: "Personal launcher for the project",
      ru: "Личный лаунчер для проекта"
    },
    tags: ["C++", "TypeScript / JavaScript (React / Node.js)", "HTML5 / CSS3 (Tailwind CSS)", "MySQL"],
    link: ""
  },
    {
    name: "FrogMC",
    status: "in-dev",
    date: "2026",
    description: {
      en: "A Discord bot to maintain activity, in return receiving roles; logs of main actions on the server",
      ru: "Дискорд бот для поддержания актива, взамен получая роли; логи основных действий на сервере"
    },
    tags: ["Python", "discord.py", "sqlite3"],
    link: ""
  },
    {
    name: "NVX",
    status: "in-dev",
    date: "2026",
    description: {
      en: "no bio yet",
      ru: "пока нет информации"
    },
    tags: ["soon"],
    link: ""
  },
    {
    name: "Sonya Bot",
    status: "planned",
    date: "",
    description: {
      en: "A Discord bot that allows you to earn coins, buy businesses, and play gambling games",
      ru: "Дискорд бот с возможностью зарабатывать монеты, покупать бизнесы, играть в азартные игры"
    },
    tags: ["Python", "discord.py", "sqlite3"],
    link: ""
  },
    {
    name: "Sonya AI",
    status: "archived",
    date: "ALPHA TEST | 2.0",
    description: {
      en: "A personal AI assistant for any tasks, activated by voice, inspired by Jarvis",
      ru: "Личный ИИ-Помощник для любых задач с активацией по голосу, сделано по мотивам Jarvis"
    },
    tags: ["JavaScript / JSX (React + Node.js)", "Python", "HTML5 / CSS (Tailwind CSS)", "C++ (Win32)"],
    link: "https://skrinshoter.ru/sdcsoxFb5nD"
  },
  ];
