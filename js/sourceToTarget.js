countries =
    ['AE', 'AF', 'AL', 'AR', 'AT', 'BA', 'BD', 'BF', 'BG', 'BH', 'BO', 'BY',
        'CD', 'CI', 'CN', 'CO', 'CY', 'CZ', 'DK', 'EC', 'EG', 'ER', 'GH', 'GN',
        'GW', 'HK', 'HT', 'ID', 'IN', 'IT', 'JO', 'JP', 'KG', 'KH', 'KR', 'KW',
        'KZ', 'LA', 'LB', 'LK', 'MD', 'MG', 'MK', 'ML', 'MM', 'MU', 'MX', 'MY',
        'NE', 'NG', 'NP', 'OM', 'PH', 'PL', 'QA', 'RO', 'RU', 'SA', 'SG', 'SL',
        'SN', 'SV', 'SY', 'TH', 'TJ', 'TM', 'TR', 'TT', 'TW', 'UA', 'UG', 'Unknown',
        'US', 'UZ', 'VN', 'Y1', 'ZA', 'ZZ']


function updateSourceToTarget(year, removeAll = false, enableMouseover = true, highLightMaxSrc = false) {
    if (removeAll) {
        svg.selectAll('*').remove();
    }

    var years = ['2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018']
    var yearScale = d3.scaleBand()
        .domain(years)
        .range([0, width - margin.right]);


    var slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + [margin.left, height + margin.top] + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", yearScale.range()[0])
        .attr("x2", yearScale.range()[1] - yearScale.step())
        .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
        .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function () { slider.interrupt(); })
            .on("start drag", function () {
                var eachBand = yearScale.step();
                var index = Math.round((d3.event.x / eachBand));
                var d = yearScale.domain()[index];
                updateSourceToTarget(d, true);
            })
        );

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(years)
        .enter()
        .append("text")
        .attr("x", yearScale)
        .attr("y", 10)
        .attr("fill", "#eee")
        .attr("text-anchor", "middle")
        .text(function (d) { return d; });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("fill", "#eee")
        .attr("cx", yearScale(year))
        .attr("r", 9);

    var filteredData = humanTraffickingData.filter(function (d) {
        if (year == "allYears") {
            return true;
        } else {
            //console.log(d['Year of Registration']);
            return d['Year of Registration'] == year;
        }
    });

    // A linear scale to position the nodes on the X axis
    var x = d3.scalePoint()
        .domain(countries)
        .range([margin.left, width - margin.right]);

    var size = d3.scaleLinear()
        .domain([0, 1300])
        .range([10, 30]);

    var fontSize = d3.scaleLinear()
        .domain([900, 2000])
        .range([8, 18]);

    var source = {};
    for (var i = 0; i < filteredData.length; i++) {
        var c = filteredData[i]['Citizenship'];
        if (c in source) {
            source[c] += 1;
        } else {
            source[c] = 1;
        }

    }

    var sourceMaxIdx = Object.keys(source).reduce(function (a, b) { return source[a] > source[b] ? a : b });

    var target = {};
    for (var i = 0; i < filteredData.length; i++) {
        var c = filteredData[i]['Country_of_Exploitation'];
        if (c in target) {
            target[c] += 1;
        } else {
            target[c] = 1;
        }
    }

    //Add the circle for the nodes
    var targetCircle = svg
        .selectAll(".target_countries")
        .data(countries);

    var targetCircleEnter = targetCircle.enter()
        .append('circle')
        .attr('class', 'target_countries')
        .attr("cx", 0)
        .attr("cy", 0)
        //.attr("r", function (d) { return 5; })
        .style("fill", "#CF6766")
        .attr("stroke", "white");

    targetCircle.merge(targetCircleEnter)
        .attr("r", function (d) {
            if (d in target) { return size(target[d]); }
            else { return 0; }
        })
        .attr('transform', function (d) {
            return 'translate(' + [x(d), height - 30] + ')';
        });

    var sourceCircle = svg
        .selectAll(".source_countries")
        .data(countries);

    var sourceCircleEnter = sourceCircle.enter()
        .append("circle")
        .attr('class', 'source_countries')
        .attr("cx", 0)
        .attr("cy", 0)
        //.attr("r", function (d) { return 5; })
        .style("fill", "#328CC1")
        .attr("stroke", "white");

    sourceCircle.merge(sourceCircleEnter)
        .attr("r", function (d) {
            if (d in source) { return size(source[d]); }
            else { return 0; }
        })
        .attr('transform', function (d) {
            return 'translate(' + [x(d), height - 30] + ')';
        });

    // Add the label
    var labels = svg.selectAll(".labels")
        .data(countries);

    var labelsEnter = labels.enter()
        .append('text')
        .attr('class', 'labels')
        .attr('x', 0)
        .attr('y', 0)
        .text(function (d) { return (d) })
        .style('text-anchor', 'end')
        .style('text-align', 'center')
        .style('font-size', fontSize(width))
        .style('fill', '#eee');

    labels.merge(labelsEnter)
        .attr('transform', function (d) {
            return ('translate(' + [x(d), (height - 15)] + ')rotate(-45)')
        });

    // Add the links
    destToSrc = {}
    var links = svg.selectAll(".links")
        .data(filteredData);

    var linksEnter = links.enter()
        .append('path')
        .attr('class', 'links')
        .style('fill', 'none')
        .attr('stroke', '#eee')
        .style('stroke-width', 1)

    links.merge(linksEnter)
        .attr('d', function (d) {
            var src = d['Citizenship']
            var dest = d['Country_of_Exploitation']

            var start = x(src)
            var end = x(dest)

            if (dest in destToSrc) {
                var arr = destToSrc[dest];
                arr.add(src);
                destToSrc[dest] = arr;
            } else {
                destToSrc[dest] = new Set([src]);
            }


            return ['M', start, height - 30,
                'A',
                (start - end) / 2, ',',
                (start - end) / 2, 0, 0, ',',
                start < end ? 1 : 0, end, ',', height - 30]
                .join(' ')
        });

    if (enableMouseover) {
        sourceCircleEnter
            .on('mouseover', function (d) {
                // Highlight the nodes: every node is green except of him
                sourceCircleEnter
                    .style('opacity', .2)
                d3.select(this)
                    .style('opacity', 1)

                targetCircleEnter
                    .style('opacity', function (circle_d) { var set = destToSrc[circle_d]; return set ? (set.has(d) ? 1 : .2) : .2; })

                // Highlight the connections
                linksEnter
                    .style('stroke', function (link_d) { return link_d['Citizenship'] === d ? '#328CC1' : '#eee'; })
                    //.style('sroke-opacity', function (link_d) { return link_d['Citizenship'] === d || link_d['Country_of_Exploitation'] === d['Country_of_Exploitation'] ? 1 : .2; })
                    .style('stroke-width', function (link_d) { return link_d['Citizenship'] === d ? 4 : 1; })

                labelsEnter
                    .style('font-size', function (label_d) { var set = destToSrc[label_d]; return label_d === d || (set ? set.has(d) : false) ? fontSize(width) * 2 : fontSize(width) / 2 })
                    .attr('y', function (label_d) { return label_d === d ? 10 : 0 })
            })
            .on('mouseout', function (d) {
                sourceCircleEnter.style('opacity', 1)
                targetCircleEnter.style('opacity', 1)
                linksEnter
                    .style('stroke', '#eee')
                    //.style('stroke-opacity', .8)
                    .style('stroke-width', 1)
                labelsEnter
                    .style('font-size', fontSize(width))
                    .attr('y', 0)
            })
    }

    if (!enableMouseover || highLightMaxSrc) {
        sourceCircleEnter
            .style('opacity', function (circle_d) {
                return circle_d == sourceMaxIdx ? 1 : .2;
            });

        targetCircleEnter
            .style('opacity', function (circle_d) { var set = destToSrc[circle_d]; return set ? (set.has(sourceMaxIdx) ? 1 : .2) : .2; })

        // Highlight the connections
        linksEnter
            .style('stroke', function (link_d) { return link_d['Citizenship'] === sourceMaxIdx ? '#328CC1' : '#eee'; })
            //.style('sroke-opacity', function (link_d) { return link_d['Citizenship'] === d || link_d['Country_of_Exploitation'] === d['Country_of_Exploitation'] ? 1 : .2; })
            .style('stroke-width', function (link_d) { return link_d['Citizenship'] === sourceMaxIdx ? 4 : 1; })

        labelsEnter
            .style('font-size', function (label_d) { var set = destToSrc[label_d]; return label_d === sourceMaxIdx || (set ? set.has(sourceMaxIdx) : false) ? fontSize(width) * 2 : fontSize(width) / 2 })
            .attr('y', function (label_d) { return label_d === sourceMaxIdx ? 10 : 0 })

    }

    targetCircle.exit().remove();
    sourceCircle.exit().remove();
    labels.exit().remove();
    links.exit().remove();
}

// event listener
function onYearChanged() {
    var select = d3.select('#stt_yearSelector').property('value');

    updateSourceToTarget(select);
}

function loadSrcToDstAll() {
    svg.selectAll('*').remove();
    svg.append('image')
        .attr('xlink:href', '../resources/srcTodstAll.png')
        .attr('width', '50%')
        .attr('height', '100%');
}