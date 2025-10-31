package com.example.eventscheduler

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
fun EventList(events: List<Event>, modifier: Modifier = Modifier) {
    Column(modifier.padding(16.dp)) {
        for (e in events) {
            Card(modifier = Modifier.fillMaxWidth().padding(8.dp)) {
                Column(Modifier.padding(16.dp)) {
                    Text(e.title, style = MaterialTheme.typography.titleLarge)
                    Text(e.date)
                    Text(e.location)
                    Text(e.description)
                }
            }
        }
    }
}
