async function fetchData() {
  // Define headers and body for the POST request
  const headersList = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "cookie": "2b42a5900eca15e8f83f64787af73f39=uebto9rbk4n5lesaqo9rguvu81; _gid=GA1.3.1241966776.1721301100; _gat=1; _hjSession_1418246=eyJpZCI6IjJmNGYyMGRkLWY0NzAtNGQzZi05YTIwLTljMDI1OTVjNjYyZCIsImMiOjE3MjEzMDExMDA1OTYsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjoxLCJzcCI6MH0=; _gcl_au=1.1.947149258.1721301101; _gat_UA-123966122-1=1; _clck=1u41wig%7C2%7Cfnk%7C0%7C1660; _sp_ses.d8be=*; _hjSessionUser_1418246=eyJpZCI6IjU5ZDczMjJmLWMxNmItNTZjOC1iMTkzLTIwYzViZmJjMjM1YyIsImNyZWF0ZWQiOjE3MjEzMDExMDA1OTYsImV4aXN0aW5nIjp0cnVlfQ==; _ga_DLNE5SQR95=GS1.3.1721301101.1.1.1721301114.47.0.1214879005; _clsk=16gb86p%7C1721301114651%7C2%7C1%7Co.clarity.ms%2Fcollect; _ga_J7S7MLGERW=GS1.1.1721301101.1.1.1721301145.16.0.0; _ga=GA1.1.2137416140.1721301100; _ga_CJ0C9KLLCY=GS1.1.1721301101.1.1.1721301145.16.0.0; _sp_id.d8be=77f7e926958a93d8.1721301102.1.1721301146.1721301102",
    "origin": "https://www.nationallottery.co.za",
    "priority": "u=1, i",
    "referer": "https://www.nationallottery.co.za/lotto-history",
    "sec-ch-ua": "Chromium",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "macOS",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "x-requested-with": "XMLHttpRequest"
  };
  
  const gameName = process.argv[2] || 'LOTTO';
  const bodyContent = `gameName=${gameName}&offset=0&limit=10&isAjax=true`;

  try {
    // Fetch the data from the API
    const response = await fetch("https://www.nationallottery.co.za/index.php?task=results.getViewAllURL&amp;Itemid=265&amp;option=com_weaver&amp;controller=lotto-history", { 
      method: "POST",
      body: bodyContent,
      headers: headersList
    });
    
    // Convert the response to text
    const responseText = await response.text();
    
    // Parse the response as JSON
    const data = JSON.parse(responseText);
    
    // Call the function to generate random numbers based on this data
    const randomNumbers = generateWeightedRandomNumbers(data);
    
    console.log("Generated Random Numbers:", randomNumbers);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function generateWeightedRandomNumbers(jsonData) {
  // Step 1: Parse the JSON and extract the ball frequencies
  const draws = jsonData.data;
  const frequency = {};

  // Initialize frequency count for each number
  for (let i = 1; i <= 60; i++) {
    frequency[i] = 0;
  }
  
  // Calculate frequency of each number
  draws.forEach(draw => {
    for (let i = 1; i <= 6; i++) {
      const ball = parseInt(draw[`ball${i}`], 10);
      if (ball >= 1 && ball <= 60) {
        frequency[ball] += 1;
      }
    }
  });

  // Step 2: Create a weighted list
  const weightedList = [];
  Object.keys(frequency).forEach(num => {
    for (let i = 0; i < frequency[num]; i++) {
      weightedList.push(parseInt(num, 10));
    }
  });

  // Step 3: Randomly select 7 unique numbers from the weighted list
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const selectedNumbers = new Set();
  
  while (selectedNumbers.size < 7) {
    const randomIndex = getRandomInt(weightedList.length);
    selectedNumbers.add(weightedList[randomIndex]);
  }

  return Array.from(selectedNumbers);
}

// Call the fetchData function to execute
fetchData();
