import { extractYoutubeVideoId, getThumbnailUrl, msToTime } from "./App"

const sharedVideo = "https://youtu.be/3fv0iVcCeh4?si=BbDEyYoitc3SX3nE"
const normalVideo = "https://www.youtube.com/watch?v=3fv0iVcCeh4"
const playlist = "https://www.youtube.com/watch?v=tO8aJ-TUtJY&list=PL96C35uN7xGJu6skU4TBYrIWxggkZBrF5&index=1&t=12s"
const timestamp = "www.youtube.com/watch?v=3fv0iVcCeh4&t=12s"
const sharedVideoTimestamp = "https://youtu.be/3fv0iVcCeh4?si=BbDEyYoitc3SX3nE&t=12s"

describe("function extractYoutubeVideoId", () => {
  test("should return the Youtube video ID for a valid URL", () => {
    expect(extractYoutubeVideoId(sharedVideo)).toBe("3fv0iVcCeh4")
    expect(extractYoutubeVideoId(normalVideo)).toBe("3fv0iVcCeh4")
    expect(extractYoutubeVideoId(playlist)).toBe("tO8aJ-TUtJY")
    expect(extractYoutubeVideoId(timestamp)).toBe("3fv0iVcCeh4")
    expect(extractYoutubeVideoId(sharedVideoTimestamp)).toBe("3fv0iVcCeh4")
  })

  test("should throw an error for an invalid URL", () => {
    expect(() => extractYoutubeVideoId("https://www.youtube.com/")).toThrowError("Invalid Youtube URL")
  })
})

describe("function getThumbnailUrl", () => {
  test("should return the thumbnail URL for a valid URL", () => {
    expect(getThumbnailUrl(sharedVideo)).toBe("https://img.youtube.com/vi/3fv0iVcCeh4/0.jpg")
    expect(getThumbnailUrl(normalVideo)).toBe("https://img.youtube.com/vi/3fv0iVcCeh4/0.jpg")
    expect(getThumbnailUrl(playlist)).toBe("https://img.youtube.com/vi/tO8aJ-TUtJY/0.jpg")
    expect(getThumbnailUrl(timestamp)).toBe("https://img.youtube.com/vi/3fv0iVcCeh4/0.jpg")
    expect(getThumbnailUrl(sharedVideoTimestamp)).toBe("https://img.youtube.com/vi/3fv0iVcCeh4/0.jpg")
  })

  test("should throw an error for an invalid URL", () => {
    expect(() => getThumbnailUrl("https://www.youtube.com/")).toThrowError("Invalid Youtube URL")
  })
})

describe("function msToTime", () => {
  test("should return the correct time format", () => {
    expect(msToTime(0)).toBe("00:00")
    expect(msToTime(1000)).toBe("00:01")
    expect(msToTime(10000)).toBe("00:10")
    expect(msToTime(60000)).toBe("01:00")
    expect(msToTime(3600000)).toBe("01:00:00")
    expect(msToTime(3661000)).toBe("01:01:01")
  })
})
