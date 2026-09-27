#!/usr/bin/env python3
"""Build the self-contained forms site for GitHub Pages; no runtime server."""
import argparse
import html
import re
import shutil
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent

class Metadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ''
        self.heading = ''
        self.description = ''
        self.capture = None
        self.heading_seen = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'title':
            self.capture = 'title'
        elif tag == 'h2' and not self.heading_seen:
            self.capture = 'heading'
            self.heading_seen = True
        elif tag == 'br' and self.capture:
            setattr(self, self.capture, getattr(self, self.capture) + ' ')
        elif tag == 'meta' and attrs.get('name', '').lower() == 'description':
            self.description = attrs.get('content', '')

    def handle_endtag(self, tag):
        if tag in ('title', 'h2'):
            self.capture = None

    def handle_data(self, data):
        if self.capture:
            setattr(self, self.capture, getattr(self, self.capture) + data)

def catalog():
    items = []
    for path in sorted(ROOT.iterdir(), key=lambda p: p.name.casefold()):
        if (path.suffix.lower() not in ('.html', '.htm') or path.name.lower() == 'index.html'
                or path.name.startswith('.') or path.is_symlink() or not path.is_file()):
            continue
        try:
            parser = Metadata()
            parser.feed(path.read_text(encoding='utf-8', errors='replace'))
            title = ' '.join((parser.heading or parser.title or path.stem).split())
            items.append({'file': path.name, 'title': title,
                          'description': parser.description or 'خصّص النموذج، وجهّز نسختك للمشاركة أو الطباعة.'})
        except OSError:
            # A file can disappear while a form is being renamed or removed.
            continue
    return items


def build(output):
    output = Path(output).resolve()
    output.mkdir(parents=True, exist_ok=True)
    if any(output.iterdir()):
        raise ValueError('Build destination must be empty.')
    forms = catalog()
    cards = []
    for number, form in enumerate(forms, 1):
        file, title, description = form['file'], form['title'], form['description']
        cards.append(f'<a class="card" href="{quote(file)}"><span class="number" dir="ltr">{number:02}</span><div class="card-content"><p class="label">نموذج نجم العراق</p><h2>{html.escape(title)}</h2><p class="description">{html.escape(description)}</p></div><span class="open">افتح النموذج ←</span></a>')
        shutil.copyfile(ROOT / file, output / file)
    index = (ROOT / 'index.html').read_text()
    index = re.sub(r'<!-- FORMS:START -->.*?<!-- FORMS:END -->', lambda _: '<!-- FORMS:START -->' + ''.join(cards) + '<!-- FORMS:END -->', index, flags=re.S)
    index = re.sub(r'(<p class="eyebrow" id="count">).*?(</p>)', lambda m: m[1] + f'مكتبة الفريق · {len(forms)} نماذج' + m[2], index)
    (output / 'index.html').write_text(index)
    (output / '.nojekyll').write_text('')
    return forms

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    forms = build(args.output)
    print(f'Built {len(forms)} forms for GitHub Pages.')
