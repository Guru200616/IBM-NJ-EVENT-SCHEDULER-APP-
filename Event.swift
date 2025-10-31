import Foundation

struct Event: Identifiable, Codable {
    let id: UUID
    var title: String
    var description: String
    var date: Date
    var location: String
}
