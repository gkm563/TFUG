class sum 
{
    public static void main(String args[]) 
    {
        int n=Integer.parseInt(args[0]);
        int s=0;
        while(n>0)
        {
            s=s+n %10;
            n=n/10;
            

            
        }
        System.out.println(" sum of digits is" + s);
    }   
}