def collect_static_files(request):
    """
    Collect all static files from templates directory
    """
    from django.core.management import call_command
    call_command('collectstatic', interactive=False)
    return HttpResponse('Static files collected successfully')