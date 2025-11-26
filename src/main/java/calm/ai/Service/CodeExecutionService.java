package calm.ai.Service;

import calm.ai.Model.ListNode;
import org.springframework.stereotype.Service;

import javax.tools.*;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.lang.reflect.Method;
import java.net.URI;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.*;

@Service
public class CodeExecutionService {

    public Map<String, Object> executeCode(String problemId, String userCode) {
        Map<String, Object> result = new HashMap<>();

        // 1. Wrap code in a class
        String className = "Solution" + System.currentTimeMillis();
        String fullSource = "import calm.ai.Model.ListNode;\n" +
                "import java.util.*;\n" +
                "public class " + className + " {\n" +
                userCode + "\n" +
                "}";

        // 2. Compile
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        if (compiler == null) {
            result.put("success", false);
            result.put("output", "Compiler not found. Ensure you are running on JDK, not JRE.");
            return result;
        }

        StandardJavaFileManager fileManager = compiler.getStandardFileManager(null, null, null);
        List<JavaSourceFromString> fileObjects = Collections
                .singletonList(new JavaSourceFromString(className, fullSource));

        // Output compilation errors to string
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        boolean success = compiler
                .getTask(new java.io.OutputStreamWriter(outputStream), fileManager, null, null, null, fileObjects)
                .call();

        if (!success) {
            result.put("success", false);
            result.put("output", "Compilation Error:\n" + outputStream.toString());
            return result;
        }

        // 3. Load and Execute
        try {
            // Load the compiled class
            URLClassLoader classLoader = URLClassLoader.newInstance(new URL[] { new File(".").toURI().toURL() });
            Class<?> cls = Class.forName(className, true, classLoader);
            Object instance = cls.getDeclaredConstructor().newInstance();

            // Run Test Cases based on problemId
            return runTestCases(problemId, cls, instance);

        } catch (Exception e) {
            result.put("success", false);
            result.put("output", "Runtime Error: " + e.getMessage());
            e.printStackTrace();
            return result;
        } finally {
            // Cleanup .class file
            new File(className + ".class").delete();
        }
    }

    private Map<String, Object> runTestCases(String problemId, Class<?> cls, Object instance) throws Exception {
        Map<String, Object> result = new HashMap<>();
        List<String> logs = new ArrayList<>();
        boolean allPassed = true;

        switch (problemId) {
            case "two-sum":
                Method twoSum = cls.getMethod("twoSum", int[].class, int.class);
                int[][][] tsTests = {
                        { { 2, 7, 11, 15 }, { 9 } },
                        { { 3, 2, 4 }, { 6 } },
                        { { 3, 3 }, { 6 } }
                };
                int[][] tsExpected = { { 0, 1 }, { 1, 2 }, { 0, 1 } };

                for (int i = 0; i < tsTests.length; i++) {
                    int[] nums = tsTests[i][0];
                    int target = tsTests[i][1][0];
                    int[] expected = tsExpected[i];

                    try {
                        int[] actual = (int[]) twoSum.invoke(instance, nums, target);
                        Arrays.sort(actual); // Order doesn't matter usually, but for comparison
                        if (!Arrays.equals(expected, actual)) {
                            logs.add("Test Case " + (i + 1) + " Failed: Input=" + Arrays.toString(nums) + ", Target="
                                    + target +
                                    ". Expected " + Arrays.toString(expected) + ", Got " + Arrays.toString(actual));
                            allPassed = false;
                        } else {
                            logs.add("Test Case " + (i + 1) + " Passed!");
                        }
                    } catch (Exception e) {
                        logs.add("Test Case " + (i + 1) + " Error: " + e.getCause().getMessage());
                        allPassed = false;
                    }
                }
                break;

            case "reverse-list":
                Method reverseList = cls.getMethod("reverseList", ListNode.class);
                int[][] rlTests = {
                        { 1, 2, 3, 4, 5 },
                        { 1, 2 },
                        {}
                };
                int[][] rlExpected = {
                        { 5, 4, 3, 2, 1 },
                        { 2, 1 },
                        {}
                };

                for (int i = 0; i < rlTests.length; i++) {
                    ListNode input = ListNode.fromArray(rlTests[i]);
                    int[] expectedArr = rlExpected[i];

                    try {
                        ListNode actualNode = (ListNode) reverseList.invoke(instance, input);
                        int[] actualArr = actualNode == null ? new int[0] : actualNode.toArray();

                        if (!Arrays.equals(expectedArr, actualArr)) {
                            logs.add("Test Case " + (i + 1) + " Failed: Input=" + Arrays.toString(rlTests[i]) +
                                    ". Expected " + Arrays.toString(expectedArr) + ", Got "
                                    + Arrays.toString(actualArr));
                            allPassed = false;
                        } else {
                            logs.add("Test Case " + (i + 1) + " Passed!");
                        }
                    } catch (Exception e) {
                        logs.add("Test Case " + (i + 1) + " Error: " + e.getCause().getMessage());
                        allPassed = false;
                    }
                }
                break;

            case "palindrome":
                Method isPalindrome = cls.getMethod("isPalindrome", int.class);
                int[] pTests = { 121, -121, 10 };
                boolean[] pExpected = { true, false, false };

                for (int i = 0; i < pTests.length; i++) {
                    try {
                        boolean actual = (boolean) isPalindrome.invoke(instance, pTests[i]);
                        if (actual != pExpected[i]) {
                            logs.add("Test Case " + (i + 1) + " Failed: Input=" + pTests[i] +
                                    ". Expected " + pExpected[i] + ", Got " + actual);
                            allPassed = false;
                        } else {
                            logs.add("Test Case " + (i + 1) + " Passed!");
                        }
                    } catch (Exception e) {
                        logs.add("Test Case " + (i + 1) + " Error: " + e.getCause().getMessage());
                        allPassed = false;
                    }
                }
                break;

            default:
                logs.add("Unknown problem ID");
                allPassed = false;
        }

        result.put("success", allPassed);
        result.put("output", String.join("\n", logs));
        return result;
    }

    // Helper for in-memory compilation
    static class JavaSourceFromString extends SimpleJavaFileObject {
        final String code;

        JavaSourceFromString(String name, String code) {
            super(URI.create("string:///" + name.replace('.', '/') + Kind.SOURCE.extension), Kind.SOURCE);
            this.code = code;
        }

        @Override
        public CharSequence getCharContent(boolean ignoreEncodingErrors) {
            return code;
        }
    }
}
