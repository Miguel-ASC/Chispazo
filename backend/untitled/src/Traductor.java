import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Scanner;

public class Traductor {

    public static void main(String[] args) {
        Map<String, String> diccionario = new HashMap<>();
        diccionario.put("casa", "house");
        diccionario.put("perro", "dog");
        diccionario.put("gato", "cat");
        diccionario.put("libro", "book");
        diccionario.put("agua", "water");
        diccionario.put("sol", "sun");
        diccionario.put("luna", "moon");
        diccionario.put("mesa", "table");
        diccionario.put("silla", "chair");
        diccionario.put("coche", "car");
        diccionario.put("arbol", "tree");
        diccionario.put("flor", "flower");
        diccionario.put("puerta", "door");
        diccionario.put("ventana", "window");
        diccionario.put("ciudad", "city");
        diccionario.put("pais", "country");
        diccionario.put("amigo", "friend");
        diccionario.put("familia", "family");
        diccionario.put("trabajo", "work");
        diccionario.put("escuela", "school");
        diccionario.put("comida", "food");
        diccionario.put("tiempo", "time");


        List<String> spanish = new ArrayList<>(diccionario.keySet());
        List<String> selection = seleccionarPalabrasAlAzar(spanish, 5);

        // 3. Pedir al usuario la traducción y comprobar si es correcta
        Scanner scanner = new Scanner(System.in);
        int bien = 0;
        int mal = 0;

        System.out.println("open inglich");
        System.out.println("responde las 5 .\n");

        for (int i = 0; i < selection.size(); i++) {
            String palabraEspanol = selection.get(i);
            String traduccionCorrecta = diccionario.get(palabraEspanol);

            System.out.print((i + 1) + ". " + palabraEspanol + " => ");
            String respuestaUsuario = scanner.nextLine().trim();

            if (respuestaUsuario.equalsIgnoreCase(traduccionCorrecta)) {
                System.out.println("    ¡Ei!");
                bien++;
            } else {
                System.out.println("    desonrra. la buena es : " + traduccionCorrecta);
                mal++;
            }
        }

        // 4. Mostrar el resultado final
        System.out.println("\n=== Resultado final ===");
        System.out.println("Respuestas bien:   " + bien);
        System.out.println("Respuestas mal: " + mal);

        scanner.close();
    }

    /**
     * Selecciona 'cantidad' elementos al azar y sin repetir de una lista dada.
     */
    private static List<String> seleccionarPalabrasAlAzar(List<String> lista, int cantidad) {
        List<String> copia = new ArrayList<>(lista);
        List<String> seleccionadas = new ArrayList<>();
        Random random = new Random();

        for (int i = 0; i < cantidad && !copia.isEmpty(); i++) {
            int indiceAlAzar = random.nextInt(copia.size());
            seleccionadas.add(copia.remove(indiceAlAzar));
        }

        return seleccionadas;
    }
}