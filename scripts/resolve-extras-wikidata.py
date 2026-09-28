import json,urllib.request,urllib.parse,re
from collections import defaultdict
from pathlib import Path
src=json.load(open('source-extras.json'))
for group in ['shorts','series']:
 rows=src[group]
 existing_path=Path(f'{group}-resolved.json')
 existing={r['name']:r for r in json.loads(existing_path.read_text())} if existing_path.exists() else {}
 values=' '.join(json.dumps(r['name'])+'@en' for r in rows)
 q=f'SELECT DISTINCT ?label ?imdb ?date ?companyLabel WHERE {{ VALUES ?label {{ {values} }} ?film rdfs:label ?label; wdt:P345 ?imdb; wdt:P577 ?date. OPTIONAL {{ ?film wdt:P272 ?company. }} SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }} }} LIMIT 3000'
 u='https://query.wikidata.org/sparql?'+urllib.parse.urlencode({'query':q,'format':'json'})
 req=urllib.request.Request(u,headers={'User-Agent':'StremioStudioCatalog/1.0'})
 hits=json.load(urllib.request.urlopen(req,timeout=90))['results']['bindings']
 byname=defaultdict(lambda:defaultdict(set))
 for h in hits:
  byname[h['label']['value']][h['imdb']['value']].add((int(h['date']['value'][:4]),h.get('companyLabel',{}).get('value','')))
 out=[]
 for row in rows:
  if existing.get(row['name'],{}).get('imdb'):
   out.append(existing[row['name']])
   continue
  candidates=[]
  for imdb,dates in byname[row['name']].items():
   score=max((3 if company=='Pixar' else 0)+(1 if year==row['year'] else 0) for year,company in dates if abs(year-row['year'])<=1) if any(abs(y-row['year'])<=1 for y,_ in dates) else -1
   if score>=0:candidates.append((score,imdb))
  candidates.sort(reverse=True)
  if candidates and (len(candidates)==1 or candidates[0][0]>candidates[1][0]):
   out.append({**row,'imdb':candidates[0][1],'resolution':'Wikidata title, year, studio'})
  else:
   out.append({**row,'error':'unresolved','candidates':candidates})
 existing_path.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
 print(group,len([r for r in out if 'imdb' in r]),'/',len(out))
 print([(r['name'],r.get('candidates')) for r in out if 'imdb' not in r])
