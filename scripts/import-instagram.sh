#!/bin/bash

# replacing spaces with underscores
for file in *; do mv "$file" `echo $file | tr ' ' '_'` ; done

# creating subfolders and moving files
for x in ./*.jpg; do
  mkdir "${x%.*}" && mv "$x" "${x%.*}"
done
for x in ./*.mp4; do
  mkdir "${x%.*}" && mv "$x" "${x%.*}"
done

# creating index.md for each subfolder
for dir in *;
	do date=`cut -d'_' -f 1 <<< "$dir"`;
		file=$dir'.jpg';
		time=`cut -d'_' -f 2 <<< "$dir" | sed -e 's/\./\:/g'`;
		datetime=$date'T'$time'+00:00';
		printf '%s\n' '---'  "date: $datetime"  "featured_image: /instagram/$dir/$file"  'title: Untitled'  '---' '' > $dir/index.md ;
	done
