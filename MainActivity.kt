package com.example.eventscheduler

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.*
import androidx.compose.runtime.*
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

interface ApiService {
    @GET("events") suspend fun getEvents(): List<Event>
    @POST("events") suspend fun addEvent(@Body event: Event)
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            EventSchedulerApp()
        }
    }
}

@Composable
fun EventSchedulerApp() {
    val api = remember {
        Retrofit.Builder()
            .baseUrl("http://10.0.2.2:8000/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
    val coroutine = rememberCoroutineScope()
    var events by remember { mutableStateOf(listOf<Event>()) }

    LaunchedEffect(Unit) {
        events = api.getEvents()
    }

    Scaffold(
        topBar = { TopAppBar(title = { Text("Event Scheduler") }) },
        floatingActionButton = {
            FloatingActionButton(onClick = {
                coroutine.launch {
                    api.addEvent(Event("id", "Meeting", "Discuss project", "2025-11-01", "Office"))
                    events = api.getEvents()
                }
            }) { Text("+") }
        }
    ) { padding ->
        EventList(events, Modifier.padding(padding))
    }
}
