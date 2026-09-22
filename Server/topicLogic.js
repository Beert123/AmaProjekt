import { loadTopicStats } from "./Data/topicsStats";

function findMostCommonSubject(stats) {
    let highestStat = "";
    let mostCommon = 0;
    for (const [topic, count] of Object.entries(stats)) {
        if (count > mostCommon) {
            mostCommon = count;
            highestStat = topic;
        }
    }
    return highestStat;
}
