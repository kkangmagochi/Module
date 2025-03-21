// main.js

import * as Character from './character.js';
import * as Stats from './stats.js';
import * as UI from './ui.js';
import * as API from './api.js';
import * as Storage from './storage.js';
import * as Dialog from './dialog.js';
import * as Animation from './animation.js';

document.addEventListener('DOMContentLoaded', () => {
    Storage.loadFromLocalStorage();
    Character.displayCurrentCharacter();
    Stats.updateStatsDisplay();
    UI.init(); // 인자 없이 호출

    if (Storage.getApiKey()) {
        API.testApiConnection();
    }
});
