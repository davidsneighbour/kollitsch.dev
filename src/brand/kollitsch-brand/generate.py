#!/usr/bin/env python3
"""Generate KOLLITSCH.dev brand assets; requires fonttools, cairosvg, pillow."""
import argparse, json, re, sys, io
from pathlib import Path
from xml.etree import ElementTree as ET
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parent
FRAME = 'M14 36V22Q14 14 22 14H36 M84 14H98Q106 14 106 22V36 M106 84V98Q106 106 98 106H84 M36 106H22Q14 106 14 98V84'

def luminance(c):
    if not re.fullmatch(r'#[0-9a-fA-F]{6}', c): raise ValueError(f'Invalid colour: {c}')
    v=[int(c[i:i+2],16)/255 for i in (1,3,5)]
    return sum(w*(x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4) for w,x in zip((.2126,.7152,.0722),v))

def validate(palettes):
    for name,p in palettes.items():
        for role,minimum,preferred in [('foreground',4.5,7),('muted',4.5,7),('primary',3,4.5)]:
            a,b=sorted((luminance(p[role]),luminance(p['background'])))
            r=(b+.05)/(a+.05)
            print(f'{name:5} {role:10} {r:.3f}:1 (minimum {minimum}, preferred {preferred})')
            if r<minimum: raise ValueError(f'{name}/{role}: contrast below {minimum}:1')

def icon():
    return f'<g id="iconmark"><path id="frame" d="{FRAME}" fill="none" stroke="var(--logo-foreground)" stroke-width="5.5" stroke-linecap="round"/><g id="wildcard" fill="var(--logo-primary)"><circle id="dot" cx="33" cy="85" r="5.5"/><g id="asterisk" transform="translate(72 65)" stroke="var(--logo-primary)" stroke-width="9" stroke-linecap="butt" fill="none">'+''.join(f'<path d="M0 -24V24" transform="rotate({a})"/>' for a in (0,60,120))+'</g></g></g>'

def text_geometry(fontpath):
    f=TTFont(fontpath); names=f['name']; family=names.getDebugName(16) or names.getDebugName(1); style=names.getDebugName(17) or names.getDebugName(2)
    if family.lower()!='changa one' or style.lower()!='regular': raise ValueError(f'Expected Changa One Regular; got {family} {style}')
    gs=f.getGlyphSet(); cmap=f.getBestCmap(); metrics=f['hmtx'].metrics
    kern={}
    if 'kern' in f:
        for table in f['kern'].kernTables: kern.update(table.kernTable)
    def layout(text,scale,tracking):
        x=0; paths=[]; bounds=[]; prev=None
        for ch in text:
            n=cmap[ord(ch)]; x+=kern.get((prev,n),0)*scale if prev else 0
            pen=SVGPathPen(gs); bp=BoundsPen(gs)
            transform=(scale,0,0,-scale,x,0)
            gs[n].draw(TransformPen(pen,transform)); gs[n].draw(TransformPen(bp,transform))
            paths.append(pen.getCommands()); bounds.append(bp.bounds); x+=metrics[n][0]*scale+tracking; prev=n
        return paths,(min(b[0] for b in bounds),min(b[1] for b in bounds),max(b[2] for b in bounds),max(b[3] for b in bounds))
    _,b=layout('KOLLITSCH',1,0); scale=51/(b[3]-b[1]); paths,b=layout('KOLLITSCH',scale,-1.1)
    x=124-b[0]; y=60-(b[1]+b[3])/2
    ep,eb=layout('.dev',scale*2/3,-1.1*2/3); ex=x+b[2]+2.5-eb[0]
    def group(id,role,ps,tx,ty): return f'<g id="{id}" fill="var(--logo-{role})" transform="translate({tx:.8f} {ty:.8f})">'+''.join(f'<path d="{p}"/>' for p in ps)+'</g>'
    return '<g id="wordmark">'+group('surname','foreground',paths,x,y)+group('domain-extension','muted',ep,ex,y)+'</g>', (124,min(y+b[1],y+eb[1]),ex+eb[2],max(y+b[3],y+eb[3]))

def svg(content,box,p=None,opaque=False,master=False):
    x,y,w,h=box
    if master:
        styles=':root {'+';'.join(f'--logo-{k}:{v}' for k,v in p.items())+'}'
        css=f'<style>{styles}</style>'
    else:
        for k,v in p.items(): content=content.replace(f'var(--logo-{k})',v)
        css=''
    bg=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{p["background"]}"/>' if opaque else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x:.8g} {y:.8g} {w:.8g} {h:.8g}" role="img" aria-labelledby="title"><title id="title">KOLLITSCH.dev</title>{css}{bg}{content}</svg>\n'

def write(path,s): path.parent.mkdir(parents=True,exist_ok=True); ET.fromstring(s); path.write_text(s,encoding='utf-8')

def main():
    ap=argparse.ArgumentParser(description=__doc__); ap.add_argument('--font',type=Path,help='Path to authentic Changa One Regular TTF or WOFF2; omit to generate from the outlined master SVG'); ap.add_argument('--output',type=Path,default=ROOT/'dist'); args=ap.parse_args()
    palettes=json.loads((ROOT/'palette.json').read_text()); validate(palettes)
    dark=palettes['dark']; ic=icon(); marks={'iconmark':(ic,(0,0,120,120))}
    if args.font:
        wm,b=text_geometry(args.font); marks.update({'wordmark':(wm,(b[0]-11.25,b[1]-11.25,b[2]-b[0]+22.5,b[3]-b[1]+22.5)),'combination-mark':(ic+wm,(0,0,b[2]+11.25,120))})
        write(ROOT/'logo.master.svg',svg(ic+wm,marks['combination-mark'][1],dark,master=True))
    else:
        ET.register_namespace('', 'http://www.w3.org/2000/svg')
        master=ET.parse(ROOT/'logo.master.svg').getroot()
        ns={'s':'http://www.w3.org/2000/svg'}
        def extract(name):
            node=master.find(f".//s:g[@id='{name}']",ns)
            if node is None: raise ValueError(f'Missing master group: {name}')
            return ET.tostring(node,encoding='unicode')
        ic=extract('iconmark'); wm=extract('wordmark')
        boxes=json.loads((ROOT/'mark-bounds.json').read_text())
        marks={'iconmark':(ic,boxes['iconmark']),'wordmark':(wm,boxes['wordmark']),'combination-mark':(ic+wm,boxes['combination-mark'])}
    if args.font:
        (ROOT/'mark-bounds.json').write_text(json.dumps({k:v[1] for k,v in marks.items()},indent=2)+'\n')
    variants=dict(palettes)
    for name,p in palettes.items(): variants['monochrome-'+name]={**p,'muted':p['foreground'],'primary':p['foreground']}
    for name,p in variants.items():
        for mark,(content,box) in marks.items(): write(args.output/name/(mark+'.svg'),svg(content,box,p))
    for name,p in palettes.items():
        target=args.output/'favicon'/name; source=svg(ic,(0,0,120,120),p,True); write(target/'favicon.svg',source)
        for n in (16,24,32,48,64,96,180,192,512):
            cairosvg.svg2png(bytestring=source.encode(),write_to=str(target/f'icon-{n}.png'),output_width=n,output_height=n)
        # Explicit per-size PNG frames preserve independent rasterisation.
        frames=[Image.open(target/f'icon-{n}.png').convert('RGBA') for n in (16,32,48)]
        frames[-1].save(target/'favicon.ico',sizes=[(16,16),(32,32),(48,48)],append_images=frames[:-1])
    print(f'Generated assets: {args.output}')

if __name__=='__main__':
    try: main()
    except Exception as e: print(f'ERROR: {e}',file=sys.stderr); sys.exit(1)
