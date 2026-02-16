// ===== Analytics & Event Tracking =====
// This file handles all analytics events for the Shabd Khoj game
// Based on the old game's exact event format

// Initialize dataLayer for GTM
window.dataLayer = window.dataLayer || [];

// ===== EXACT FORMAT FROM OLD GAME =====

// 1. Game Start Events (EXACT match with old game)
function trackGameStart() {
    try {
        // Event 1: Generic platform event
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'game_start'
        });
        
        // Event 2: Specific web platform event
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_game_started'
        });
        
        console.log('📊 Game start events tracked (old game format)');
    } catch (error) {
        console.error('Error tracking game start:', error);
    }
}

// 2. Intro Screen View
function trackIntroView() {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'intro_view'
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_intro_shown'
        });
        
        console.log('📊 Intro view tracked');
    } catch (error) {
        console.error('Error tracking intro view:', error);
    }
}

// 3. Word Found Event
function trackWordFound(word, points, timeTaken, wordNumber, totalWords) {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'word_found',
            'word_length': word.length,
            'points': points,
            'time_seconds': timeTaken,
            'word_number': wordNumber,
            'total_words': totalWords
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_word_found',
            'Sk_word_length': word.length,
            'Sk_points': points,
            'Sk_progress': Math.round((wordNumber / totalWords) * 100)
        });
        
        console.log('📊 Word found tracked:', word.length, 'letters,', points, 'points');
    } catch (error) {
        console.error('Error tracking word found:', error);
    }
}

// 4. Word Attempt Failed
function trackWordAttemptFailed(selectedLetters) {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'word_failed',
            'letters_count': selectedLetters.length
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_word_failed'
        });
        
        console.log('📊 Failed word attempt tracked');
    } catch (error) {
        console.error('Error tracking failed attempt:', error);
    }
}

// 5. Game Complete Event
function trackGameComplete(finalScore, bestScore, wordsFound, totalWords, timeTaken, coinsEarned = 0) {
    try {
        const isAllWordsFound = wordsFound === totalWords;
        const completionRate = Math.round((wordsFound / totalWords) * 100);
        
        // Standard tracking events
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'game_complete',
            'final_score': finalScore,
            'words_found': wordsFound,
            'total_words': totalWords,
            'completion_rate': completionRate,
            'time_taken': timeTaken,
            'coins_earned': coinsEarned,
            'all_words_found': isAllWordsFound
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': isAllWordsFound ? 'Sk_web_game_complete_success' : 'Sk_web_game_complete_partial',
            'Sk_score': finalScore,
            'Sk_best_score': bestScore,
            'Sk_completion': completionRate,
            'Sk_coins': coinsEarned
        });
        
        // GA4 event (EXACT format from old game)
        window.dataLayer.push({
            'event': 'game_data',
            'Augame': 'crossword_end',
            'final_score': finalScore,
            'words_found': wordsFound,
            'total_words': totalWords,
            'coins_earned': coinsEarned
        });
        
        console.log('📊 Game complete tracked:', finalScore, 'points,', coinsEarned, 'coins');
    } catch (error) {
        console.error('Error tracking game complete:', error);
    }
}

// 6. Game Timeout Event
function trackGameTimeout(currentScore, wordsFound, totalWords) {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'game_timeout',
            'score': currentScore,
            'words_found': wordsFound,
            'total_words': totalWords
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_game_timeout',
            'Sk_score': currentScore
        });
        
        console.log('📊 Game timeout tracked');
    } catch (error) {
        console.error('Error tracking timeout:', error);
    }
}

// 7. Hint Used Event
function trackHintUsed(wordNumber, penaltyPoints) {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'hint_used',
            'word_number': wordNumber,
            'penalty': penaltyPoints
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_hint_used',
            'Sk_penalty': penaltyPoints
        });
        
        console.log('📊 Hint used tracked');
    } catch (error) {
        console.error('Error tracking hint:', error);
    }
}

// 8. Refresh/Restart Game
function trackRefreshGame(source = 'button') {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'game_refresh',
            'source': source
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_game_refresh',
            'Sk_source': source
        });
        
        console.log('📊 Game refresh tracked from:', source);
    } catch (error) {
        console.error('Error tracking refresh:', error);
    }
}

// 9. Back Button Click
function trackBackButton(source = 'header') {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'back_click',
            'source': source
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_back_click'
        });
        
        // GA4 event (EXACT format from old game)
        window.dataLayer.push({
            'event': 'game_data',
            'Augame': 'crossword_exit'
        });
        
        console.log('📊 Back button tracked (crossword_exit)');
    } catch (error) {
        console.error('Error tracking back button:', error);
    }
}

// 10. Modal Close
function trackModalClose(modalType = 'game_over') {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'modal_close',
            'modal_type': modalType
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_modal_close',
            'Sk_modal': modalType
        });
        
        // GA4 event (EXACT format from old game)
        window.dataLayer.push({
            'event': 'game_data',
            'Augame': 'crossword_close'
        });
        
        console.log('📊 Modal close tracked (crossword_close):', modalType);
    } catch (error) {
        console.error('Error tracking modal close:', error);
    }
}

// 11. Claim Coins Button
function trackClaimCoins(coinsAmount) {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'coins_claim',
            'coins': coinsAmount
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_coins_claimed',
            'Sk_coins': coinsAmount
        });
        
        console.log('📊 Coins claim tracked:', coinsAmount);
    } catch (error) {
        console.error('Error tracking coins claim:', error);
    }
}

// 12. Settings Changes
function trackSettingChange(settingName, newValue) {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'setting_change',
            'setting': settingName,
            'value': newValue
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_setting_change',
            'Sk_setting': settingName
        });
        
        console.log('📊 Setting changed:', settingName, '=', newValue);
    } catch (error) {
        console.error('Error tracking setting change:', error);
    }
}

// 13. Theme Change
function trackThemeChange(themeName) {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'theme_change',
            'theme': themeName
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_theme_change',
            'Sk_theme': themeName
        });
        
        console.log('📊 Theme changed to:', themeName);
    } catch (error) {
        console.error('Error tracking theme change:', error);
    }
}

// 14. Language Change
function trackLanguageChange(language) {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'language_change',
            'language': language
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_language_change',
            'Sk_language': language
        });
        
        console.log('📊 Language changed to:', language);
    } catch (error) {
        console.error('Error tracking language change:', error);
    }
}

// 15. Difficulty Change
function trackDifficultyChange(difficulty) {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'difficulty_change',
            'difficulty': difficulty
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_difficulty_change',
            'Sk_difficulty': difficulty
        });
        
        console.log('📊 Difficulty changed to:', difficulty);
    } catch (error) {
        console.error('Error tracking difficulty change:', error);
    }
}

// 16. Sound Toggle
function trackSoundToggle(isEnabled) {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'sound_toggle',
            'enabled': isEnabled
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': isEnabled ? 'Sk_web_sound_on' : 'Sk_web_sound_off'
        });
        
        console.log('📊 Sound toggled:', isEnabled ? 'ON' : 'OFF');
    } catch (error) {
        console.error('Error tracking sound toggle:', error);
    }
}

// 17. Vibration Toggle
function trackVibrationToggle(isEnabled) {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'vibration_toggle',
            'enabled': isEnabled
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': isEnabled ? 'Sk_web_vibration_on' : 'Sk_web_vibration_off'
        });
        
        console.log('📊 Vibration toggled:', isEnabled ? 'ON' : 'OFF');
    } catch (error) {
        console.error('Error tracking vibration toggle:', error);
    }
}

// 18. Web-to-App Banner View
function trackWebToAppBannerView() {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'app_banner_view'
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_app_banner_shown'
        });
        
        console.log('📊 App banner view tracked');
    } catch (error) {
        console.error('Error tracking app banner view:', error);
    }
}

// 19. Web-to-App Download Click
function trackWebToAppDownloadClick(source = 'button') {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'app_download_click',
            'source': source
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_app_download_click',
            'Sk_source': source
        });
        
        console.log('📊 App download click tracked from:', source);
    } catch (error) {
        console.error('Error tracking app download:', error);
    }
}

// 20. Web-to-App Banner Close
function trackWebToAppBannerClose() {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'app_banner_close'
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_app_banner_closed'
        });
        
        console.log('📊 App banner close tracked');
    } catch (error) {
        console.error('Error tracking app banner close:', error);
    }
}

// 21. Error Tracking
function trackError(errorType, errorMessage) {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'error',
            'error_type': errorType,
            'error_message': errorMessage
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_error',
            'Sk_error_type': errorType
        });
        
        console.error('📊 Error tracked:', errorType, errorMessage);
    } catch (error) {
        console.error('Error tracking error event:', error);
    }
}

// 22. Page Load Performance
function trackPageLoad(loadTime) {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'page_load',
            'load_time_ms': loadTime
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_page_loaded',
            'Sk_load_time': loadTime
        });
        
        console.log('📊 Page load tracked:', loadTime, 'ms');
    } catch (error) {
        console.error('Error tracking page load:', error);
    }
}

// 23. Game Load Performance
function trackGameLoadTime(loadTime) {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'game_load',
            'load_time_ms': loadTime
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_game_loaded',
            'Sk_load_time': loadTime
        });
        
        console.log('📊 Game load tracked:', loadTime, 'ms');
    } catch (error) {
        console.error('Error tracking game load:', error);
    }
}

// 24. Session Start
function trackSessionStart() {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'session_start',
            'timestamp': new Date().toISOString()
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_session_start'
        });
        
        console.log('📊 Session start tracked');
    } catch (error) {
        console.error('Error tracking session start:', error);
    }
}

// 25. Session End
function trackSessionEnd(duration) {
    try {
        window.dataLayer.push({
            'event': 'shabdkhoj',
            'games': 'session_end',
            'duration_seconds': duration
        });
        
        window.dataLayer.push({
            'event': 'Shabdkhoj_Web',
            'Sk_web': 'Sk_web_session_end',
            'Sk_duration': duration
        });
        
        console.log('📊 Session end tracked:', duration, 'seconds');
    } catch (error) {
        console.error('Error tracking session end:', error);
    }
}

// Make all functions available globally
window.gameTracking = {
    trackGameStart,
    trackIntroView,
    trackWordFound,
    trackWordAttemptFailed,
    trackGameComplete,
    trackGameTimeout,
    trackHintUsed,
    trackRefreshGame,
    trackBackButton,
    trackModalClose,
    trackClaimCoins,
    trackSettingChange,
    trackThemeChange,
    trackLanguageChange,
    trackDifficultyChange,
    trackSoundToggle,
    trackVibrationToggle,
    trackWebToAppBannerView,
    trackWebToAppDownloadClick,
    trackWebToAppBannerClose,
    trackError,
    trackPageLoad,
    trackGameLoadTime,
    trackSessionStart,
    trackSessionEnd
};

console.log('✅ Shabd Khoj tracking initialized (old game format)');
