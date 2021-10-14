<?php

// @todo make this configurable
$username = 'pkollitsch';
$apikey = '6d3ecd54e5535b7665962ca3b00723bf';
$extended = 1;
$limit = 200;
$path = 'content/lastfm/';

// create enquiry
$file = 'http://ws.audioscrobbler.com/2.0/?';
$file .= '&method=user.getrecenttracks';
$file .= '&user='.$username;
$file .= '&api_key='.$apikey;
$file .= '&format=json';
$file .= '&extended='.$extended;
$file .= '&limit='.$limit;

// "do it".
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $file);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$output = curl_exec($ch);
curl_close($ch);
$output = json_decode($output, true);

foreach ($output['recenttracks']['track'] as $item){
  $mdcontent = '---' . "\n";
  $mdcontent .= 'artistname: "' . $item['artist']['name'] . '"' . "\n";
  $mdcontent .= 'artistlink: "' . $item['artist']['url'] . '"' . "\n";
  foreach ($item['artist']['image'] as $image){
    if ($image['size'] !== 'extralarge'){
      continue;
    }
    $mdcontent .= 'artistimage: "'. $image['#text'] . '"' . "\n";
  }
  $mdcontent .= 'loved: ' . $item['loved'] . "\n";
  $mdcontent .= 'title: "'. $item['name'] . '"' . "\n";
  $mdcontent .= 'albumtitle: "'. $item['album']['#text'] . '"' . "\n";
  $mdcontent .= 'link: "'. $item['url'] . '"' . "\n";
  foreach ($item['image'] as $image){
    if ($image['size'] !== 'extralarge'){
      continue;
    }
    $mdcontent .= 'songimage: "'. $image['#text'] . '"' . "\n";
  }
  $mdcontent .= 'date: '. date('c', $item['date']['uts']) . "\n";
  $mdcontent .= '---' . "\n"."\n";

  // now creating a package folder
  if (!is_dir($path . date('Y-m-d-H-i', $item['date']['uts']))){
    mkdir($path . date('Y-m-d-H-i', $item['date']['uts']), 0755);
  }
  file_put_contents($path . date('Y-m-d-H-i', $item['date']['uts']) . '/index.md', $mdcontent);
}
