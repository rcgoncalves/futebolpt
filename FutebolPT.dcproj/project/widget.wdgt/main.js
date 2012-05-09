/*
 * Copyright (C) 2009, Rui Carlos Gonçalves (rcgoncalves.pt@gmail.com)
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU
 * General Public License as published by the Free Software Foundation; either version 2 of the License,
 * or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General
 * Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program; if not,
 * write to the Free Software Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 *
 */

//
// Function: load()
// Called by HTML body element's onload event when the widget is ready to start
//
function load()
{
    dashcode.setupParts();
    _compress();
    populateRounds();
}

//
// Function: remove()
// Called when the widget has been removed from the Dashboard
//
function remove()
{
    // Stop any timers to prevent CPU usage
    // Remove any preferences as needed
    // widget.setPreferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
}

//
// Function: hide()
// Called when the widget has been hidden
//
function hide()
{
    // Stop any timers to prevent CPU usage
}

//
// Function: show()
// Called when the widget has been shown
//
function show()
{
    // Restart any timers that were stopped on hide
}

//
// Function: sync()
// Called when the widget has been synchronized with .Mac
//
function sync()
{
    // Retrieve any preference values that you need to be synchronized here
    // Use this for an instance key's value:
    // instancePreferenceValue = widget.preferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
    //
    // Or this for global key's value:
    // globalPreferenceValue = widget.preferenceForKey(null, "your-key");
}

//
// Function: showBack(event)
// Called when the info button is clicked to show the back of the widget
//
// event: onClick event from the info button
//
function showBack(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToBack");
    }

    front.style.display = "none";
    back.style.display = "block";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
}

//
// Function: showFront(event)
// Called when the done button is clicked from the back of the widget
//
// event: onClick event from the done button
//
function showFront(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToFront");
    }

    front.style.display="block";
    back.style.display="none";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
}

if (window.widget) {
    widget.onremove = remove;
    widget.onhide = hide;
    widget.onshow = show;
    widget.onsync = sync;
}

function showResults(event)
{    
  var feedURL='http://www.lpfp.pt/liga_zon_sagres/Pages/Jornada.aspx';
  var onloadHandler=function() {processResults(xmlRequest);};

  var xmlRequest = new XMLHttpRequest();
  xmlRequest.onload = onloadHandler;
  xmlRequest.open('GET', feedURL);
  xmlRequest.setRequestHeader('Cache-Control', 'no-cache');
  xmlRequest.send(null);
}

function processResults(xmlRequest)
{
  window.resizeTo(320, 380);
  $('text').style.visibility='visible';
  $('info').style.visibility='visible';
  $('front').childNodes[1].setAttribute('src','Parts/Images/front.png');
  
  if (xmlRequest.status == 200)
  {
    var html=xmlRequest.responseText;
    $('text').innerHTML='';
    $('tmp').innerHTML=html;
    var results=$('MatchDayWP').innerHTML;
    $('tmp').innerHTML='';
    results=getFirstElementByTagName(results,'div',1);
    var round=(results.match(/Jornada\s*nº\s*\d+/))[0];
    round=(round.match(/\d+/))[0];
    results=results.replace(/<h3>Jornada\s*nº\s*\d+<\/h3>/,'<h4>&nbsp;</h4>');
    results=results.replace(/width=\"\d+px\"/,'width="100%"');//"
    results=results.replace(/src=\"([^\"]*)\"/g,"src=\"http://www.lpfp.pt/$1\"");//"
    $('tmp').innerHTML=results;
    var contents=$('tg').childNodes[0];
    var len=contents.childNodes.length;

    var node=contents.childNodes[0];
    node.removeChild(node.childNodes[0]);
    node.removeChild(node.childNodes[1]);
    for(var i=2;i<7;i++)
    {
      node.removeChild(node.childNodes[2]);
    }

    for(var i=2;i<len;i+=2)
    {
      var node=contents.childNodes[i];
      node.childNodes[0].innerHTML=node.childNodes[1].innerHTML;
      node.childNodes[0].setAttribute('class','club_l');
      node.childNodes[1].innerHTML=node.childNodes[2].innerHTML;
      node.childNodes[1].setAttribute('class','crest_l');
      node.childNodes[2].innerHTML=node.childNodes[3].innerHTML;
      node.childNodes[2].setAttribute('class','result');
      node.childNodes[3].innerHTML=node.childNodes[4].innerHTML;
      node.childNodes[3].setAttribute('class','crest_r');
      node.childNodes[4].innerHTML=node.childNodes[5].innerHTML;
      node.childNodes[4].setAttribute('class','club_r');
      node.childNodes[5].innerHTML=node.childNodes[7].innerText+'<br/>'+node.childNodes[9].innerText;
      var className=node.childNodes[11].childNodes[0].className;
      if(className)
      {
        if(className.match('sporttv1'))
        {
          node.childNodes[5].setAttribute('title','SportTV1');
        }
        else if(className.match('tvi'))
        {
          node.childNodes[5].setAttribute('title','TVI');
        }
      }
      node.childNodes[5].setAttribute('class','date');
      
      for(var j=6;j<13;j++)
      {
        node.removeChild(node.childNodes[6]);
      }
    }
  
    $('tg').innerHTML=contents.innerHTML;
    results=$('tmp').innerHTML;
    $('tmp').innerHTML='';
    text.innerHTML='<div id="results_contents">'+results+'</div>';
    
    var cb=$('popup');
    cb.childNodes[0].childNodes[1].innerHTML=round;
    cb.childNodes[2].selectedIndex=round-1;
    $('text8').style.visibility='visible';
    $('popup').style.visibility='visible';
  }
  else
  {
    alert('Error fetching data: HTTP status ' + xmlRequest.status);
    $('text').innerHTML="Não foi possível obter os dados!\n(HTTP status "+xmlRequest.status+')';
  }
}

function showClassification(event)
{
  var feedURL='http://www.lpfp.pt/liga_zon_sagres/Pages/Jornada.aspx';
  var onloadHandler=function() {processClassification(xmlRequest);};

  var xmlRequest = new XMLHttpRequest();
  xmlRequest.onload = onloadHandler;
  xmlRequest.open('GET', feedURL);
  xmlRequest.setRequestHeader('Cache-Control','no-cache');
  xmlRequest.send(null);
}

function processClassification(xmlRequest)
{
  window.resizeTo(320, 380);
  $('text').style.visibility='visible';
  $('info').style.visibility='visible';
  $('front').childNodes[1].setAttribute('src','Parts/Images/front.png');
  
	if (xmlRequest.status == 200)
  {
    $('text8').style.visibility='hidden';
    $('popup').style.visibility='hidden';
    
    var html=xmlRequest.responseText;
    $('tmp').innerHTML=html;
    var classification=$('sidebar-nav-comp-display').innerHTML;
    $('tmp').innerHTML='';
    classification=getFirstElementByTagName(classification,'table',0);
    classification=getFirstElementByTagName(classification,'table',1);
    classification=classification.replace(/<img[^>]*>/g,'');
    $('text').innerHTML='<div id="classification_contents">'+classification+'</div>';
	}
	else
  {
		alert('Error fetching data: HTTP status ' + xmlRequest.status);
    $('text').innerHTML="Não foi possível obter os dados!\n(HTTP status "+xmlRequest.status+')';
	}
}

/*function processClassification(xmlRequest)
{
	if (xmlRequest.status == 200)
  {
    $('text8').style.visibility='hidden';
    $('popup').style.visibility='hidden';
    
    var html=xmlRequest.responseText;
    $('tmp').innerHTML=html;
    var results=$('MatchDayWP').innerHTML;
    $('tmp').innerHTML='';
    classification=getFirstElementByTagName(results,'div',0);
    classification=classification.replace(/<img[^>]*>/g,'');
    classification=classification.replace(/<h3>.*<\/h3>/,'');
    classification=classification.replace(/width=\"\d+px\"/,'width="100%"');//"
    $('text').innerHTML=classification;
	}
	else
  {
		alert('Error fetching data: HTTP status ' + xmlRequest.status);
    $('text').innerHTML="Não foi possível obter os dados!\n(HTTP status "+xmlRequest.status+')';
	}
}*/

function showRound(event)
{
  var round=$('popup').childNodes[2].selectedIndex+1;
  var feedURL='http://www.lpfp.pt/liga_zon_sagres/Pages/Jornada.aspx?Jornada='+round;
  var onloadHandler=function() {processResults(xmlRequest);};

  var xmlRequest = new XMLHttpRequest();
  xmlRequest.onload = onloadHandler;
  xmlRequest.open('GET', feedURL);
  xmlRequest.setRequestHeader('Cache-Control', 'no-cache');
  xmlRequest.send(null);
}

function populateRounds()
{	
  var nrounds=30;
  var rounds=$('popup').childNodes[2];
	while (rounds.hasChildNodes())
		rounds.removeChild(round.firstChild);
	
  for(var i=1; i<=nrounds; i++)
  {
    var element=document.createElement('option');
    element.innerText=i;
    element.setAttribute('name',i);
    element.selected=false;
    rounds.appendChild(element);
  }
}

function $(id)
{
  return document.getElementById(id);
}

function compress(event)
{
  _compress();
}

function _compress()
{
  $('text8').style.visibility='hidden';
  $('popup').style.visibility='hidden';
  $('text').style.visibility='hidden';
  $('info').style.visibility='hidden';
  var elem=$('front').childNodes;
  $('front').childNodes[1].setAttribute('src','Parts/Images/front_small.png');
  window.resizeTo(320, 60);
}


function openProjectPage(event)
{
    if( window.widget) {
        widget.openURL( "http://rcgoncalves.pt/project/futebolpt/" );
        return false;
    }
}


function openRCG(event)
{
    if( window.widget) {
        widget.openURL( "http://rcgoncalves.pt/" );
        return false;
    }
}
