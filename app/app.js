function constructParameters(arrayOfKeywords) {
    var parameters = {};
    for (var i = 0; i < arrayOfKeywords.length; i++) {
        if (arrayOfKeywords[i].length > 0) {
            if (i === 0) {
                parameters['locality__locality'] = arrayOfKeywords[i];
            }
            if (i === 1) {
                parameters['stratigraphy__stratigraphy'] = arrayOfKeywords[i];
            }
            if (i === 2) {
                parameters['number__contains'] = arrayOfKeywords[i];
            }
            if (i === 3) {
                parameters['rock__contains'] = arrayOfKeywords[i];
            }
            if (i === 4 && arrayOfKeywords[5].length > 0) {
                parameters['depth__range'] = arrayOfKeywords[i] + ',' + arrayOfKeywords[5];
                //parameters['depth_interval__range'] = arrayOfKeywords[i] + ',' + arrayOfKeywords[5];
            }
            if (i === 4 && arrayOfKeywords[5].length === 0) {
                parameters['depth'] = arrayOfKeywords[i];
            }
            if (i === 5 && arrayOfKeywords[4].length === 0) {
                parameters['depth_interval'] = arrayOfKeywords[i];
            }
        }
    }
    return parameters;
}

function constructURL() {
    var url = 'https://api2.geokogud.info/sample/?';

    var searchKeyword1 = $('#locality__locality').val().trim();
    var searchKeyword2 = $('#stratigraphy__stratigraphy').val().trim();
    var searchKeyword3 = $('#number').val().trim();
    var searchKeyword4 = $('#rock').val().trim();
    var searchKeyword5 = $('#depth').val().trim();
    var searchKeyword6 = $('#depth_interval').val().trim();

    var arrayOfKeywords = [searchKeyword1, searchKeyword2, searchKeyword3, searchKeyword4, searchKeyword5, searchKeyword6];

    var urlParameters = $.param(constructParameters(arrayOfKeywords));
    //console.log(urlParameters);
    url += urlParameters + "&fields=id,database__acronym,number,locality__locality,rock,depth,depth_interval,stratigraphy__stratigraphy,lithostratigraphy__stratigraphy,agent_collected__agent,date_collected";

    return url;
}

function deleteTableBeforeNewData() {
    if ($('#table-body tr').length > 0) {
        $('#geokogu-table').DataTable().rows().remove().draw();
    }
}

$('#locality__locality').keyup(function(e) {
    $('#locality__locality').next('p').remove();

    var searchLocality = $('#locality__locality').val().trim();
    var url = 'https://api2.geokogud.info/locality/?locality__icontains='
        + searchLocality
        + '&fields=locality';
    var datalist = $('#suggestions-locality');

    //console.log("search keyword: " + searchLocality + " url: " + url);

    if (searchLocality.length > 1) {

        var request = $.ajax({
            url: url + '&format=jsonp',
            dataType: 'jsonp',
            cache: true,
            //jsonpCallback: 'jsonCallback',
            success: function (response) {
                //console.log(response['count']);

                /* Ainult siis kui vastuste hulk jääb 0st kuni 75ni,
                *  kuvatakse need autocomplete väljal. Selles vahemikus
                *  testides laadis leht veel üsna optimaalselt.
                */
                if (response['count'] > 0) {

                    if (response['count'] <= 75) {

                        response['results'].forEach(function (item) {

                            var option = document.createElement('option');
                            option.value = item.locality;
                            datalist.append(option);

                        });
                    } else {
                        $('#locality__locality').after('<p class="no-results">Liiga palju tulemusi! (leitud: ' + response['count'] + ', lubatud: 75)</p>')

                    }

                } else {
                    $('#locality__locality').after('<p class="no-results">Tulemusi ei leitud!</p>')
                }
            }
        });
    }
    $('#locality__locality').next('p').remove();
    datalist.empty();
});

$('#stratigraphy__stratigraphy').keyup(function(e) {
    $('#stratigraphy__stratigraphy').next('p').remove();

    var searchStratigraphy = $('#stratigraphy__stratigraphy').val().trim();
    var url = 'https://api2.geokogud.info/stratigraphy/?stratigraphy__icontains='
        + searchStratigraphy
        + '&fields=stratigraphy';
    var datalist = $('#suggestions-stratigraphy');

    //console.log("search keyword: " + searchStratigraphy + " url: " + url);

    if (searchStratigraphy.length > 1) {

        var request = $.ajax({
            url: url + '&format=jsonp',
            dataType: 'jsonp',
            cache:true,
            //jsonpCallback: 'jsonCallback',
            success: function (response) {
                //console.log(response['count']);

                /* Ainult siis kui vastuste hulk jääb 0st kuni 75ni,
                *  kuvatakse need autocomplete väljal. Selles vahemikus
                *  testides laadis leht veel üsna optimaalselt.
                */
                if (response['count'] > 0) {

                    if (response['count'] <= 75) {

                        response['results'].forEach(function (item) {
                            var option = document.createElement('option');
                            option.value = item.stratigraphy;
                            datalist.append(option);
                        });

                    } else {
                        $('#stratigraphy__stratigraphy').after('<p class="no-results">Liiga palju tulemusi! (lubatud: ' + response['count'] + ', lubatud: 75)</p>')
                    }
                } else {
                    $('#stratigraphy__stratigraphy').after('<p class="no-results">Tulemusi ei leitud!</p>')
                }
            }
        });
    }
    $('#stratigraphy__stratigraphy').next('p').remove();
    datalist.empty();
});



$('#search-button').click(function(e) {
    e.preventDefault();
    $('#search-button').hide();
    $('.no-results').remove();
    $('#row').after('<p id="search-info"><b>Palun oota! Otsin...</b></p>');

    var url = constructURL();
    //console.log("Constructed url: " + url);

    if (url !== 'https://api2.geokogud.info/sample/?') {

        var request = $.ajax({
            url: url + '&format=jsonp',
            dataType: 'jsonp',
            cache: true,
            //jsonCallback: 'jsonCallback',
            success: function (response) {
                //console.log(response);

                deleteTableBeforeNewData();

                if (response['count'] > 0) {

                    if (response['count'] <= 3000) {

                        for (var i = 0; i < response['results'].length; i++)

                            $('#geokogu-table').DataTable().row.add([
                                response['results'][i].id,
                                response['results'][i].database__acronym,
                                response['results'][i].number,
                                response['results'][i].locality__locality,
                                response['results'][i].rock,
                                response['results'][i].depth,
                                response['results'][i].depth_interval,
                                response['results'][i].stratigraphy__stratigraphy,
                                response['results'][i].lithostratigraphy__stratigraphy,
                                response['results'][i].agent_collected__agent,
                                response['results'][i].date_collected
                            ]).draw();
                        //console.log(response['results'].length);
                    } else {
                        $('#row').after('<p class="no-results"><b>Liiga palju tulemusi, mida kuvada! (leitud: ' + response['count'] + ' lubatud: 3000)</b></p>');
                    }
                } else {
                    $('#row').after('<p class="no-results"><b>Tulemusi ei leitud!</b></p>');
                }

                $('#search-info').remove();
                //$('.row').next('p').remove();
                $('#search-button').show();
            },
            error: function () {
                alert('Otsing ületas lubatud aja piiri või liiga palju tulemusi, palun proovi uuesti või kitsenda otsingut!');
                location.reload();
            },
            timeout: 5000
        });

        /**
         * TEINE REQUEST ALGAB SIIN
         **/

        // Teine kiirelt tehtud request depth_interval__range jaoks
        if ($('#depth').val().trim() > 0 && $('#depth_interval').val().trim() > 0) {
            url = 'https://api2.geokogud.info/sample/?depth_interval__range=' + $('#depth').val().trim() + ',' + $('#depth_interval').val().trim();
            if ($('#locality__locality').val().trim().length > 0) {
                url += '&locality__locality=' + $('#locality__locality').val().trim();
            }
            if ($('#stratigraphy__stratigraphy').val().trim().length > 0) {
                url += '&stratigraphy__stratigraphy=' + $('#stratigraphy__stratigraphy').val().trim();
            }
            if ($('#number').val().trim().length > 0) {
                url += '&number=' + $('#number').val().trim();
            }
            if ($('#rock').val().trim().length > 0) {
                url += '&rock=' + $('#rock').val().trim();
            }
            url += '&fields=id,database__acronym,number,locality__locality,rock,depth,depth_interval,stratigraphy__stratigraphy,lithostratigraphy__stratigraphy,agent_collected__agent,date_collected';

            //console.log("Constructed url: " + url);
            var request = $.ajax({
                url: url + '&format=jsonp',
                dataType: 'jsonp',
                cache: true,
                //jsonpCallback: 'jsonCallback',
                success: function (response) {

                    if (response['count'] > 0) {

                        if (response['count'] <= 3000) {

                            for (var i = 0; i < response['results'].length; i++)
                                $('#geokogu-table').DataTable().row.add([
                                    response['results'][i].id,
                                    response['results'][i].database__acronym,
                                    response['results'][i].number,
                                    response['results'][i].locality__locality,
                                    response['results'][i].rock,
                                    response['results'][i].depth,
                                    response['results'][i].depth_interval,
                                    response['results'][i].stratigraphy__stratigraphy,
                                    response['results'][i].lithostratigraphy__stratigraphy,
                                    response['results'][i].agent_collected__agent,
                                    response['results'][i].date_collected
                                ]).draw();
                        }
                    }
                },
                error: function () {
                    alert('Otsing ületas lubatud aja piiri või liiga palju tulemusi, palun proovi uuesti või kitsenda otsingut!');
                    location.reload();
                },
                timeout: 5000
            });
        }

        /**
         * TEINE REQUEST LÕPEB SIIN
         **/

    } else {
        $('#search-info').remove();
        //$('.row').next('p').remove();
        $('#search-button').show();
    }
 });

// function jsonCallback(data) {
//     console.log(data);
// }

// function handleEventEnter(e) {
//     if(e.keyCode === 13) {
//         searchFromGeokogu();
//     }
// }
