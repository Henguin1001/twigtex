<!-- Using twigtex to generate the readme-->
{% set examples = ['twigcontrol','web', 'extending'] %}
# README generated from twigtex
{% for file in examples %}
## {{file}}
```Twig
{{ readFile('./examples/' ~ file ~ '/index.twig.tex')}}
```
### File Output:
```Latex
{{ readFile('./examples/' ~ file ~ '/index.tex')}}
```
{% endfor %}
