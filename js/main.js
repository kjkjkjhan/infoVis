// set the dimensions and margins of the graph
width = getDivWidth('visualization') - 30;
//height = 700;
// height = getDivWidth('graphic');
// height = height - height * .3;
height = 700;

margin = { top: 20, right: 30, bottom: 20, left: 30 };

// svg
svg = d3.select("svg");

// Load data and use this function to process each row
function mainDataPreprocessor(row) {
    return {
        'Year of Registration': row['Year of Registration'],
        'Datasource': row['Datasource'],
        'Gender': row['Gender'],
        'Age Broad': row['Age Broad'],
        'Majority Status': row['Majority Status'],
        'Majority At Exploit': row['Majority At Exploit'],
        'Majority Entry': row['Majority Entry'],
        'Citizenship': row['Citizenship'],
        'Means of Control': row['Means of Control'],
        'Reason for Trafficking': row['Reason for Trafficking'],
        'Type Of Exploitation': row['Type Of Exploitation'],
        'Type of Labour': row['Type of Labour'],
        'Type of Sex': row['Type of Sex'],
        'is Abduction': row['is Abduction'],
        'Recruiter Relationship': row['Recruiter Relationship'],
        'Country_of_Exploitation': row['Country_of_Exploitation']
    };
}

function mocDataProcessor(row) {
    return {
        exploit_type: row["exploit_type"],
        control_mean: row["control_mean"],
        count: +row['count']
    };
}

// Read the data
Promise.all([
    d3.csv('cleanData.csv', mainDataPreprocessor),
    d3.csv('meansOfControl.csv', mocDataProcessor)
]).then(function (data) {

    humanTraffickingData = data[0];
    meansOfControlData = data[1];

    var offset = '30%';
    var offset2 = '40%';

    fadeIn('story1', offset);
    fadeIn('story2', offset);
    fadeIn('story3', offset);
    fadeIn('story4', offset);
    fadeIn('story5', offset);
    fadeIn('story6', offset);
    fadeIn('story7', offset);

    fadeIn('meansOfControl1', offset);
    fadeIn('meansOfControl2', offset);
    scroll('meansOfControl3', '60%', updateMeansOfControl, clearSourceToTarget, ['sexual_exploitation', true], []);
    fadeIn('meansOfControl4', '60%');
    fadeIn('meansOfControl5', '60%');
    scroll('meansOfControl6', '60%', updateMeansOfControl, updateMeansOfControl, ['labour_exploitation', true], ['sexual_exploitation', true]);
    fadeIn('meansOfControl7', '60%');
    fadeIn('meansOfControl8', '60%');
    scroll('typeOfExploitation1', '60%', clearSourceToTarget, updateMeansOfControl, [], ['labour_exploitation', true]);
    scroll('typeOfExploitation2', offset2, updateTypoeOfExploit, clearSourceToTarget, ['2002'], []);
    scroll('typeOfExploitation3', offset2, updateTypoeOfExploit, clearSourceToTarget, ['2002', true], []);
    scroll('typeOfExploitation', offset2, updateTypoeOfExploit, clearSourceToTarget, ['2002'], []);
    scroll('content1', offset2, updateSourceToTarget, updateMeansOfControl, ['2002', true], ['labour_exploitation', true]);
    scroll('content2', offset2, updateSourceToTarget, updateSourceToTarget, ['2005'], ['2002']);
    scroll('content3', offset2, updateSourceToTarget, updateSourceToTarget, ['2007'], ['2005']);
    scroll('content4', offset2, updateSourceToTarget, updateSourceToTarget, ['2002'], ['2007']);
    scroll('content5', offset2, updateTypoeOfExploit, updateSourceToTarget, ['2009', true], ['2002', true]);
    scroll('content6', offset2, updateTypoeOfExploit, updateTypoeOfExploit, ['2002'], ['2009']);
});

function getDivWidth(id) {
    return document.getElementById(id).offsetWidth;
}

function getDivHeight(id) {
    return document.getElementById(id).offsetHeight;
}

function clearSourceToTarget() {
    svg.selectAll('*').remove();
}

// fade in div
function fadeIn(n, offset) {
    return new Waypoint({
        element: document.getElementById(n),
        handler: function (direction) {
            if (direction == 'down') {
                $(this.element).fadeTo(800, 1);
            } else {
                $(this.element).fadeTo(800, 0);
            }
        },
        offset: offset
    })
}

// waypoints scroll constructor
function scroll(n, offset, func1, func2, param1, param2) {
    fadeIn(n, offset);
    return new Waypoint({
        element: document.getElementById(n),
        handler: function (direction) {
            direction == 'down' ? func1(param1[0], param1[1]) : func2(param2[0], param2[1]);
            // if (param1.length == 1 && param2.length == 0) {
            //     direction == 'down' ? func1(param1[0]) : func2();
            // } else if (param1.length == 2 && param2.length == 0) {
            //     direction == 'down' ? func1(param1[0], param1[1]) : func2();
            // } else if (param1.length == 1 && param2.length == 1) {
            //     direction == 'down' ? func1(param1[0]) : func2(param2[0]);
            // } else if (param1.length == 1 && param2.length == 2) {
            //     direction == 'down' ? func1(param1[0]) : func2(param2[0], param2[1]);
            // } else if (param1.length == 2 && param2.length == 1) {
            //     direction == 'down' ? func1(param1[0], param1[1]) : func2(param2[0]);
            // } else {
            //     direction == 'down' ? func1(param1[0], param1[1]) : func2(param2[0], param2[1]);
            // }
        },
        offset: offset
    })
}