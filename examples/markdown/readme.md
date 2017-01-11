<!-- Using twigtex to generate the readme-->
# README generated from twigtex
## twigcontrol
```Twig
{# A very abrievated example of the twig templating language #}
{# Check out their website for more information #}
{% extends 'head.twig.tex'%}

{% block content %}
{# This is the content between the begin{document} and end{document} #}
  \section{Control Structures}
  \begin{enumerate}
    {# A loop from 1 to 5 #}
    {% for i in 1..10 %}
        \item
        {% if i % 2 == 0 %} {# A simple check for if the index "i" is even  #}
          {{ i }}
        {% else %}
          {{ random(i) }}
        {% endif %}

    {% endfor %}
  \end{enumerate}

  \section{Macros}
    {% macro listValues(arr) %}
      \begin{itemize}
        {% for item in arr %}
          \item {{item}}
        {% endfor %}
      \end{itemize}
    {% endmacro %}
    {# Macros can only be used by importing them from a file #}
    {# In this case it is the current file "_self" #}
    {% import _self as myMac %}
    {{ myMac.listValues([2,4,10,5,3]) }}

{% endblock %}

```
### File Output:
```Latex
\documentclass{article}
\usepackage{graphicx}
\usepackage{hyperref}
\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    filecolor=magenta,
    urlcolor=cyan,
}
\begin{document}
  % This is the content between the begin{document} and end{document}
  \section{Control Structures}
  \begin{enumerate}
    
            \item
        
                  0
        
            \item
        
                  2
        
            \item
        
                  3
        
            \item
        
                  4
        
            \item
        
                  3
        
            \item
        
                  6
        
            \item
        
                  2
        
            \item
        
                  8
        
            \item
        
                  1
        
            \item
        
                  10
        
      \end{enumerate}

  \section{Macros}
    
              \begin{enumerate}
                  \item 2
                  \item 4
                  \item 10
                  \item 5
                  \item 3
              \end{enumerate}
    

\end{document}

```
## web
```Twig
{% extends 'head.twig.tex'%}
{% block content %}


  \section{Making Web Requests}
  \label{sec:Making Web Requests}

    \subsection{Simple Rest API}
    \label{sub:Simple Rest API}
      Fetched from the web service \textit{What does trump think}\\
      {% for i in 0..4%}
      {% set response = requestJSON('https://api.whatdoestrumpthink.com/api/v1/quotes/random')%}
        \begin{quote}
          {{response.message}} - \textit{Donald Trump}
        \end{quote}
      {% endfor %}


    \subsection{Spotify Album API}
    \label{sub:Spotify Album API}
    {% set album = requestJSON("https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy?market=ES") %}
    Album: {{album.name}} \\
    Artist: {{ album.artists[0].name}} \\
    Label: {{ album.label }} \\

    \begin{enumerate}
          {%for track in album.tracks.items %}
            \item {{ track.name }}\\
            \textit{listen:}
              \underline{ {{track.external_urls.spotify}} }
          {% endfor %}
    \end{enumerate}

    \subsection{External Images}
    \label{sub:External Images}
    A random sports image from \underline{http://lorempixel.com/400/200/sports/}\\
    {% set image = requestImage('http://lorempixel.com/400/200/sports/', '.jpg') %}
    \includegraphics{{ '{' ~ image ~'}'}}


{% endblock %}

```
### File Output:
```Latex
\documentclass{article}
\usepackage{graphicx}
\usepackage{hyperref}
\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    filecolor=magenta,
    urlcolor=cyan,
}
\begin{document}
  

  \section{Making Web Requests}
  \label{sec:Making Web Requests}

    \subsection{Simple Rest API}
    \label{sub:Simple Rest API}
      Fetched from the web service \textit{What does trump think}\\
                    \begin{quote}
          Justice Ginsburg of the U.S. Supreme Court has embarrassed all by making very dumb political statements about me. Her mind is shot - resign! - \textit{Donald Trump}
        \end{quote}
                    \begin{quote}
          That could be a Mexican plane up there — they're getting ready to attack - \textit{Donald Trump}
        \end{quote}
                    \begin{quote}
          [Putin] is not going into Ukraine, OK, just so you understand. He’s not gonna go into Ukraine, all right? You can mark it down. You can put it down. - \textit{Donald Trump}
        \end{quote}
                    \begin{quote}
          I'd like to use really foul language. I won't do it. I was going to say they're really full of s**t, but I won't say that. - \textit{Donald Trump}
        \end{quote}
                    \begin{quote}
          I will be the greatest jobs president that God ever created. - \textit{Donald Trump}
        \end{quote}
      

    \subsection{Spotify Album API}
    \label{sub:Spotify Album API}
        Album: Global Warming \\
    Artist: Pitbull \\
    Label: Mr.305/Polo Grounds Music/RCA Records \\

    \begin{enumerate}
                      \item Global Warming\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/6OmhkSOpvYBokMKQxpIGx2 }
                      \item Don't Stop the Party\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/2iblMMIgSznA464mNov7A8 }
                      \item Feel This Moment\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/4yOn1TEcfsKHUJCL2h1r8I }
                      \item Back in Time - featured in "Men In Black 3"\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/7fmpKF0rLGPnP7kcQ5ZMm7 }
                      \item Hope We Meet Again\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/3jStb2imKd6oUoBT1zq5lp }
                      \item Party Ain't Over\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/6Q4PYJtrq8CBx7YCY5IyRN }
                      \item Drinks for You (Ladies Anthem)\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/0QTVwqcOsYd73AOkYkk0Hg }
                      \item Have Some Fun\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/10Sydb6AAFPdgCzCKOSZuI }
                      \item Outta Nowhere\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/4k61iDqmtX9nI7RfLmp9aq }
                      \item Tchu Tchu Tcha\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/7oGRkL31ElVMcevQDceT99 }
                      \item Last Night\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/60xPqMqnHZl7Jfiu6E9q8X }
                      \item I'm Off That\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/1jAdXqOSICyXYLaW9ioSur }
                      \item Echa Pa'lla (Manos Pa'rriba)\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/0fjRYHFz9ealui1lfnN8it }
                      \item Everybody Fucks\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/7of35ktwTbL906Z1i3mT4K }
                      \item Get It Started\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/2JA6A6Y5f4m7PawM58U2Op }
                      \item 11:59\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/726qZxwhP0jVyIA0ujnnhb }
                      \item Rain Over Me - Benny Benassi Remix\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/6GPER1Sx8MrBiwWxdulg5Q }
                      \item International Love - Jump Smokers Extended Mix\\
            \textit{listen:}
              \underline{ https://open.spotify.com/track/4TWgcICXXfGty8MHGWJ4Ne }
              \end{enumerate}

    \subsection{External Images}
    \label{sub:External Images}
    A random sports image from \underline{http://lorempixel.com/400/200/sports/}\\
        \includegraphics{./.texdata/.jpg}


\end{document}

```
## extending
```Twig
{{ extend('./examples/extending/samplecommand.js') }}
{{ test() }}

```
### File Output:
```Latex

Hello World

```
