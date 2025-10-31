import SwiftUI

struct ContentView: View {
    @StateObject var service = EventService()
    @State private var showingForm = false
    
    var body: some View {
        NavigationView {
            List(service.events) { event in
                VStack(alignment: .leading) {
                    Text(event.title).font(.headline)
                    Text(event.date, style: .date)
                    Text(event.location).font(.subheadline)
                }
            }
            .navigationTitle("Event Scheduler")
            .toolbar {
                Button(action: { showingForm.toggle() }) {
                    Image(systemName: "plus")
                }
            }
            .sheet(isPresented: $showingForm) {
                EventFormView(service: service)
            }
            .onAppear {
                service.fetchEvents()
            }
        }
    }
}
