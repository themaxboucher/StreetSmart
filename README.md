# StreetSmart
## Innovation & Creativity

- **The Idea:** We created **StreetSmart** to ****highlight flaws in urban planning, drive social change and empower people without cars (or even with cars) to take a healthier and cleaner approach to transportation. Rankings within cities can help bring to light data on the state of transportation and potentially encourage the creation of solutions to any problems that show up.
- **Experience Ranking:** Our core idea is bringing users data and recommendations based on other users’ experiences through ratings of various transport routes (Safety, Comfort, Scenery).
- **Weather Conditions:** We integrated a Weather API to provide real-time weather information that assists users in making informed, choices about their method of transportation.
- **Other transportation features:** The experience-rating concept is set to expand to other modes, including walking and public transportation.

## Impact & Relevance to Prompt

- **Focus on Inclusion:** Directly encourages **active transit for all individuals** and vulnerable populations, *regardless of car ownership*, by suggesting safe, pleasant routes, solving an *Inclusive Urban Design* challenge.
- **City Planning Data:** Our system aggregates route scores to provide cities with **crucial data on routes’ status, needs and potential initiatives** (e.g., a path with a consistently low *Comfort and Safety* scores needs work).
- **Urban Sustainability:** By making cycling more reliable and enjoyable, we act as a catalyst for shifting mobility, helping to **reduce urban CO2 emission**

## Feasibility & Scalability

- **Feasibility:** Comprehensive and high-quality datasets were limited and inconsistent therefore, only one reputable dataset from official government websites was used.
- **Practicality:** The system is built as an API-focused, web application making it easy to implement, and ready for real-world use. A 3D view map is provided to give the user real-world information on what their route would physically look like, as well as dynamically updated real-time weather data to further assist in transportation planning!

## Technical Execution

- **External API Integration**: Integrated **OpenWeather API**. The system fetches real-time, location-based weather data using a **Flask-based** backend to inform users with their choices of transportation methods.

## User Experience & Design

- **Intuitive Design**: The interface is modelled after the Nomad List website ( which ranks cities based on ratings). Data is presented through both Grid View and Map View.
- **Essential Context**: The ratings are displayed through different icons. Users can rate routes in real time as they view them and also explore the 3D view of the path for a more interactive and realistic experience.
