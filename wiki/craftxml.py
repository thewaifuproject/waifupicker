import xml.etree.ElementTree as ET
import json

def addNode(root, nodeTag, value): 
    node=ET.Element(nodeTag)
    node.text=value
    root.append(node)

def buildWikiText(waifu):
    return "\
{{Infobox waifu\
| name          = "+waifu['name']+"\
| image         = "+waifu["display_picture"].split('/')[-1]+"\
| series        = "+waifu["series"]['name']+"\
| description   = "+waifu["description"]+"\
}}\
[[Category:Waifu]]"

ET.register_namespace('', "http://www.mediawiki.org/xml/export-0.10/")
ET.register_namespace('xsi', "http://www.w3.org/2001/XMLSchema-instance")
tree = ET.parse('dump.xml')
waifus=json.loads(open('waifus.json').read())
pageId=3
revisionId=4
root=tree.getroot()

for waifu in waifus:
    page=ET.Element('page')
    addNode(page, 'title', waifu['name'])
    addNode(page, 'ns', '0')
    addNode(page, 'id', str(pageId))
    pageId+=1

    revision=ET.Element('revision')
    addNode(revision, 'id', str(revisionId))
    revisionId+=1
    addNode(revision, 'timestamp', '2018-12-06T15:39:59Z')

    contributor=ET.Element('contributor')
    addNode(contributor, 'username', 'God')
    addNode(contributor, 'id', str(1))
    revision.append(contributor)

    addNode(revision, 'comment', 'Import waifu')
    addNode(revision, 'model', 'wikitext')
    addNode(revision, 'format', 'text/x-wiki')

    text=ET.Element('text')
    text.text=buildWikiText(waifu)
    text.attrib={'xml:space': 'preserve', 'bytes': str(len(text.text))}
    revision.append(text)

    page.append(revision)

    root.append(page)

tree.write('import.xml')
#print(ET.tostring(root))

