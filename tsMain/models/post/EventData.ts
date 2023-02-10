type Participant = string

export interface EventData {
    date: string                  // 開催日
    startTime: string             // 開始時刻
    endTime: string               // 終了時刻
    limit: number                 // 定員. -1で制限なし
    deadline: Date                // 締切
    participants: string[]   // 参加者のリスト
}