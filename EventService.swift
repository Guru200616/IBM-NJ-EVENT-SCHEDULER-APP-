import Foundation

class EventService: ObservableObject {
    @Published var events: [Event] = []
    let baseURL = "http://127.0.0.1:8000/events"  // your backend API
    
    func fetchEvents() {
        guard let url = URL(string: baseURL) else { return }
        URLSession.shared.dataTask(with: url) { data, _, _ in
            if let data = data {
                if let decoded = try? JSONDecoder().decode([Event].self, from: data) {
                    DispatchQueue.main.async {
                        self.events = decoded
                    }
                }
            }
        }.resume()
    }
    
    func addEvent(_ event: Event) {
        guard let url = URL(string: baseURL) else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONEncoder().encode(event)
        URLSession.shared.dataTask(with: request).resume()
    }
}
