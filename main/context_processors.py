from .translations import get_translation, TRANSLATIONS

def language_context(request):
    """Har bir sahifaga tilni va tarjimalarni uzatish"""
    lang = request.session.get('lang', 'uz')
    
    # Create a dictionary with all translations for current language
    trans = {}
    for key in TRANSLATIONS:
        trans[key] = get_translation(key, lang)
    
    return {
        'lang': lang,
        't': trans,  # All translations as dictionary
    }
