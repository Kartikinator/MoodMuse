from collections import deque 

class CurrentStateUpdate():
  def __init__(self):
    self.predictions = deque(["neutral" for i in range(10)])
    self.counts = {"neutral": 10,
                   "sad": 0,
                   "happy": 0,
                   "angry": 0,
                   "disgust": 0,
                   "fear": 0,
                   "surprise": 0}
    self.curr_max = 10
    self.state = "neutral"

  def update_state(self, emotion):
    removed = self.predictions.popleft()
    self.counts[removed] -= 1
    if removed == self.state:
      self.curr_max -= 1
    self.predictions.append(emotion)
    self.counts[emotion] += 1
    if self.counts[emotion] > self.curr_max:
      self.curr_max = self.counts[emotion]
      self.state = emotion
    return self.state

state_list = CurrentStateUpdate()