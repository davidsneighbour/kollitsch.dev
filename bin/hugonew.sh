#!/usr/bin/env bash

PS3='Choose section: '
options=("News Post" "Notebook Entry" "Function" "Variable" "Quit")
select opt in "${options[@]}"
do
    case $opt in
        "News Post")
            YEAR=$(date +'%Y')
            read -r -p 'Title: ' NEWSPOST
            NEWSPOST=${NEWSPOST// /-}
            NEWSPOST=${NEWSPOST,,}
            hugo new news/"${YEAR}"/"${NEWSPOST}" --kind news
            exit
            ;;
        "Notebook Entry")
            read -r -p 'Title: ' NOTEBOOK
            NOTEBOOK=${NOTEBOOK// /-}
            NOTEBOOK=${NOTEBOOK,,}
            hugo new notebook/"${NOTEBOOK}" --kind notebook
            exit
            ;;
        "Function")
            read -r -p 'Add function: ' FUNCTION
            hugo new functions/"${FUNCTION}" --kind function
            exit
            ;;
        "Variable")
            select TYPE in File Page Section Shortcode Site Taxonomy Menu
            do
              read -r -p 'Variable name: ' VARIABLE
              hugo new variables/"${TYPE,,}"/"${VARIABLE}" --kind variable
              exit
            done
            ;;
        "Quit")
            break
            ;;
        *) echo "invalid option $REPLY";;
    esac
done
