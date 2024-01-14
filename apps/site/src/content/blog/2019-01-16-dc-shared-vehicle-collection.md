---
title: Collecting DC Shared Vehicle Locations
description: Collecting and exploring the movement of DC's shared vehicles with docked and dockless bike and scooter locations.
pubDate: "Jan 16 2019"
heroImage: '/shared-vehicles.png'
---

The steady growth of bike shares and recent explosion of dockless bikes and scooters can provide exploration and insights into the movement of the city's inhabitants. Municipalities are starting to consider and require these providers publish their vehicles' location data. So far it's tough to find near real-time location information for the parked, available vehicles from all of the available options. The provider data sources are disparate and tough to wrangle, or when they are aggregated, the data is just some stagnant snapshot at some arbitrary point in the past. Efforts are underway to improve the quality and access like [LADOT](http://www.govtech.com/fs/lime-and-spin-to-share-detailed-use-data-with-ladot.html), but it appears [DC has been able to put forth the most complete effort currently](https://ddot.dc.gov/page/dockless-api).  Even though DC's APIs are provider specific, the city focused technology company [Coord](https://coord.co/company) has got it covered.

Coord provides a [shared vehicle API](https://coord.co/quickstart/sv) with a simple interface to query shared vehicle data from cities across the states. Now most of their datasets fall into the stagnant snapshot but DC's data sharing push means we can get vehicle locations in near real time!!! So I've started capturing my own snapshots.

Since December 16, 2018, I have been collecting the locations of parked, available vehicles in the DC system.  This includes information like is it docked or dockless, bike or scooter, human or electric, and provider.  These snaps have been running every _15 minutes_ since my initial launch. In the past month, I have collected roughly **~3000** snapshots averaging **~400Kb** per snap coming to a grand total of **~1.2GB** and counting.

The next steps are load the data into PostGIS to begin looking into spatial and temporal analysis.  Some questions I want to pursue are commute patterns, weather effects, vehicle popularity, and movement frequencies.  Now if you want to also play along with this project, I have [open sourced it](https://github.com/apburnes/shared-vehicle-views) with info on quickly deploying the collection script to AWS. As this project progresses, I will continue to update and commit to the repository.

### Resources
- [Project Github Repo](https://github.com/apburnes/shared-vehicle-views)
- [Bike Share Research](https://bikeshare-research.org/) for information on different bike shares around the world and their data feeds.
- [WoBike](https://github.com/ubahnverleih/WoBike) documentation on how to connect to different shared vehicle provider APIs
