import SwiftUI

struct EventFormView: View {
    @Environment(\.dismiss) var dismiss
    @ObservedObject var service: EventService
    
    @State private var title = ""
    @State private var date = Date()
    @State private var description = ""
    @State private var location = ""
    
    var body: some View {
        NavigationView {
            Form {
                TextField("Title", text: $title)
                DatePicker("Date", selection: $date)
                TextField("Location", text: $location)
                TextField("Description", text: $description)
            }
            .navigationTitle("New Event")
            .toolbar {
                Button("Save") {
                    let newEvent = Event(
                        id: UUID(),
                        title: title,
                        description: description,
                        date: date,
                        location: location
                    )
                    service.addEvent(newEvent)
                    dismiss()
                }
            }
        }
    }
}
